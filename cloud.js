// 로그인(구글) + 계정별 자산 저장 + 닉네임 순위 (Firebase)
//  - 로그인하면 자산·보유·주문·거래 기록을 users/{uid} 에 30초마다 저장, 다른 기기에서 로그인하면 이어서
//  - 순위: 모든 사람의 총 자산 순서, 순위 화면을 켜 두면 30초마다 새로고침
//  - 시세(prices)는 지금처럼 각 기기에서 만들어지고 저장하지 않음
const SYNC_MS = 30_000;
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const cloud = { ready: false, user: null, nick: '', db: null, rankTimer: null, rankAt: 0, rows: [] };

const portfolio = () => ({ cash: state.cash, startCash: state.startCash, holdings: state.holdings, orders: state.orders,
  trades: state.trades, realized: state.realized });

// 총 자산 = 현금 + 미체결 매수로 묶인 현금 + 주식 평가금액 (화면의 총 자산과 같은 계산)
function totalAssets() {
  let value = 0;
  for (const [code, h] of Object.entries(state.holdings)) if (info(code)) value += toKRW(code, last(code)) * h.qty;
  return state.cash + reservedCash() + value;
}

function loadScript(src) {
  return new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  });
}

async function initCloud() {
  renderAccount();
  if (!window.FIREBASE_CONFIG) return;
  try {
    for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']) await loadScript(SDK + f);
  } catch { $('acc-msg').textContent = '로그인 기능을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.'; return; }
  firebase.initializeApp(window.FIREBASE_CONFIG);
  cloud.db = firebase.firestore();
  cloud.ready = true;
  firebase.auth().onAuthStateChanged(onUser);
  setInterval(pushCloud, SYNC_MS);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pushCloud(); });
  renderAccount();
}

async function onUser(user) {
  cloud.user = user;
  cloud.nick = '';
  if (user) {
    try {
      const doc = await userRef().get();
      if (doc.exists && doc.data().data) {
        // 계정에 저장된 자산으로 이어서 (이 기기의 기록 대신)
        const d = doc.data();
        Object.assign(state, d.data);
        cloud.nick = d.nick;
        save(); render();
        msg(`${d.nick}님, 저장된 자산을 불러왔습니다.`);
      } else {
        // 처음 로그인: 닉네임 정하고 지금 이 기기의 자산을 계정으로 옮김
        cloud.nick = askNick(user.displayName) || '익명' + Math.floor(Math.random() * 9000 + 1000);
        await pushCloud();
        msg(`${cloud.nick}님, 지금 자산을 계정에 저장했습니다.`);
      }
    } catch (e) { $('acc-msg').textContent = '계정 정보를 불러오지 못했습니다: ' + e.message; }
  }
  renderAccount();
  if (state.page === 'rank') refreshRank();
}

function askNick(def = '') {
  for (;;) {
    const n = prompt('순위에 보일 닉네임을 정해 주세요 (2~12자)', (def || '').slice(0, 12));
    if (n === null) return '';
    const t = n.trim();
    if (t.length >= 2 && t.length <= 12) return t;
    alert('닉네임은 2~12자로 정해 주세요.');
  }
}

const userRef = () => cloud.db.collection('users').doc(cloud.user.uid);

async function pushCloud() {
  if (!cloud.ready || !cloud.user || !cloud.nick) return;
  const total = totalAssets();
  try {
    await userRef().set({
      nick: cloud.nick, total: Math.round(total), ret: Math.round((total / START_CASH - 1) * 10000) / 100,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      data: JSON.parse(JSON.stringify(portfolio())), // undefined 값 제거
    });
  } catch {}
}

function renderAccount() {
  const box = $('account');
  if (!window.FIREBASE_CONFIG) {
    box.innerHTML = '<p class="muted">로그인·순위 기능은 아직 준비 중입니다. 지금은 이 기기에만 저장돼요.</p>';
    return;
  }
  if (!cloud.ready) { box.innerHTML = '<p class="muted">로그인 기능을 불러오는 중…</p><p id="acc-msg" class="muted"></p>'; return; }
  box.innerHTML = cloud.user
    ? `<div class="acc-row"><span><b>${esc(cloud.nick || '…')}</b> <small class="muted">${esc(cloud.user.email || '')}</small></span>
       <span><button id="acc-nick" class="ghost">닉네임 변경</button> <button id="acc-out" class="ghost">로그아웃</button></span></div>
       <p id="acc-msg" class="muted">30초마다 자산이 계정에 저장되고 순위에 반영됩니다.</p>`
    : `<div class="acc-row"><span>로그인하면 다른 기기에서도 이어서 하고, 순위에 참여할 수 있어요.</span>
       <button id="acc-in" class="acc-in">Google로 로그인</button></div><p id="acc-msg" class="muted"></p>`;
  $('acc-in')?.addEventListener('click', () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(e => { if (e.code !== 'auth/popup-closed-by-user') $('acc-msg').textContent = '로그인 실패: ' + e.message; });
  });
  $('acc-out')?.addEventListener('click', async () => { await pushCloud(); firebase.auth().signOut(); });
  $('acc-nick')?.addEventListener('click', async () => {
    const n = askNick(cloud.nick);
    if (n) { cloud.nick = n; await pushCloud(); renderAccount(); if (state.page === 'rank') refreshRank(); }
  });
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 순위 화면
async function refreshRank() {
  if (!cloud.ready) { renderRank(); return; }
  if (cloud.user) await pushCloud(); // 내 최신 자산부터 올리고
  try {
    const snap = await cloud.db.collection('users').orderBy('total', 'desc').limit(100).get();
    cloud.rows = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    cloud.rankAt = Date.now();
  } catch (e) { $('rank-msg').textContent = '순위를 불러오지 못했습니다: ' + e.message; }
  renderRank();
}

function renderRank() {
  const list = $('rank-list');
  if (!window.FIREBASE_CONFIG || !cloud.ready) {
    list.innerHTML = '';
    $('rank-msg').textContent = window.FIREBASE_CONFIG ? '불러오는 중…' : '순위 기능은 아직 준비 중입니다.';
    return;
  }
  if (!cloud.user) { list.innerHTML = ''; $('rank-msg').textContent = '내 주식 화면에서 로그인하면 순위를 볼 수 있어요.'; return; }
  const me = cloud.user.uid;
  list.innerHTML = cloud.rows.map((r, i) => `<li class="${r.uid === me ? 'me' : ''}">
      <span class="rk ${i < 3 ? 'top' : ''}">${i + 1}</span>
      <span class="rn">${esc(r.nick)}${r.uid === me ? ' <small>(나)</small>' : ''}</span>
      <span class="rv"><b>${won(r.total)}</b><small class="${cls(r.ret)}">${pct(r.ret || 0)}</small></span></li>`).join('');
  $('rank-msg').textContent = cloud.rows.length
    ? `${cloud.rows.length}명 · 30초마다 새로고침 · 마지막 ${new Date(cloud.rankAt).toLocaleTimeString('ko-KR')}`
    : '아직 순위에 아무도 없어요.';
}

// 순위 화면에 들어오면 바로 불러오고, 켜 두는 동안 30초마다
function watchRank() {
  const on = state.page === 'rank';
  if (on && !cloud.rankTimer) { refreshRank(); cloud.rankTimer = setInterval(refreshRank, SYNC_MS); }
  else if (!on && cloud.rankTimer) { clearInterval(cloud.rankTimer); cloud.rankTimer = null; }
}
document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', watchRank));
$('reset').addEventListener('click', () => setTimeout(pushCloud, 0)); // 초기화하면 계정에도 바로 반영

initCloud();
watchRank();
