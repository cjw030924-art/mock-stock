// 로그인(아이디·비밀번호 회원가입) + 계정별 자산 저장 + 닉네임 순위 (Firebase)
//  - 로그인하면 자산·보유·주문·거래 기록을 users/{uid} 에 30초마다 저장, 다른 기기에서 로그인하면 이어서
//  - 순위: 모든 사람의 총 자산 순서, 순위 화면을 켜 두면 30초마다 새로고침
//  - 시세(prices)는 지금처럼 각 기기에서 만들어지고 저장하지 않음
const SYNC_MS = 30_000;
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const cloud = { ready: false, user: null, nick: '', db: null, rankTimer: null, rankAt: 0, rows: [], mode: 'login', pendingNick: '' };
// Firebase 는 이메일로 계정을 만들므로, 아이디를 가짜 이메일로 바꿔서 씀 (실제 메일은 안 감)
const ID_DOMAIN = '@jh-stock.app';
const idOf = user => (user.email || '').replace(ID_DOMAIN, '');

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
        // 처음 로그인(회원가입 직후): 가입할 때 정한 닉네임으로, 지금 이 기기의 자산을 계정으로 옮김
        cloud.nick = cloud.pendingNick || askNick(idOf(user)) || idOf(user).slice(0, 12);
        cloud.pendingNick = '';
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
  const join = cloud.mode === 'join';
  box.innerHTML = cloud.user
    ? `<div class="acc-row"><span><b>${esc(cloud.nick || '…')}</b> <small class="muted">아이디 ${esc(idOf(cloud.user))}</small></span>
       <span><button id="acc-nick" class="ghost">닉네임 변경</button> <button id="acc-out" class="ghost">로그아웃</button></span></div>
       <p id="acc-msg" class="muted">30초마다 자산이 계정에 저장되고 순위에 반영됩니다.</p>`
    : `<p class="muted">${join ? '회원가입하면 지금 이 기기의 자산이 계정으로 옮겨지고 순위에 참여해요.' : '로그인하면 다른 기기에서도 이어서 하고, 순위에 참여할 수 있어요.'}</p>
       <form id="acc-form" class="acc-form">
         <input id="acc-id" placeholder="아이디 (영문·숫자 3~16자)" autocomplete="username" autocapitalize="off" spellcheck="false">
         <input id="acc-pw" type="password" placeholder="비밀번호 (6자 이상)" autocomplete="${join ? 'new-password' : 'current-password'}">
         ${join ? '<input id="acc-pw2" type="password" placeholder="비밀번호 확인" autocomplete="new-password"><input id="acc-name" placeholder="닉네임 (순위에 보임, 2~12자)">' : ''}
         <button class="acc-in">${join ? '회원가입' : '로그인'}</button>
       </form>
       <p class="acc-switch">${join ? '이미 계정이 있나요?' : '처음이신가요?'} <button id="acc-mode" class="link">${join ? '로그인' : '회원가입'}</button></p>
       <p id="acc-msg" class="up"></p>`;
  $('acc-mode')?.addEventListener('click', () => { cloud.mode = join ? 'login' : 'join'; renderAccount(); });
  $('acc-form')?.addEventListener('submit', e => { e.preventDefault(); submitAuth(join); });
  $('acc-out')?.addEventListener('click', async () => { await pushCloud(); firebase.auth().signOut(); });
  $('acc-nick')?.addEventListener('click', async () => {
    const n = askNick(cloud.nick);
    if (n) { cloud.nick = n; await pushCloud(); renderAccount(); if (state.page === 'rank') refreshRank(); }
  });
}

// 로그인 / 회원가입
const AUTH_ERR = {
  'auth/email-already-in-use': '이미 있는 아이디입니다.',
  'auth/invalid-credential': '아이디 또는 비밀번호가 맞지 않습니다.',
  'auth/wrong-password': '아이디 또는 비밀번호가 맞지 않습니다.',
  'auth/user-not-found': '아이디 또는 비밀번호가 맞지 않습니다.',
  'auth/weak-password': '비밀번호는 6자 이상으로 해 주세요.',
  'auth/too-many-requests': '시도가 너무 많습니다. 잠시 후 다시 해 주세요.',
  'auth/network-request-failed': '인터넷 연결을 확인해 주세요.',
};
async function submitAuth(join) {
  const id = $('acc-id').value.trim().toLowerCase(), pw = $('acc-pw').value, say = t => ($('acc-msg').textContent = t);
  if (!/^[a-z0-9_]{3,16}$/.test(id)) return say('아이디는 영문 소문자·숫자·_ 3~16자로 해 주세요.');
  if (pw.length < 6) return say('비밀번호는 6자 이상으로 해 주세요.');
  try {
    if (join) {
      const nick = $('acc-name').value.trim();
      if (pw !== $('acc-pw2').value) return say('비밀번호 확인이 맞지 않습니다.');
      if (nick.length < 2 || nick.length > 12) return say('닉네임은 2~12자로 해 주세요.');
      cloud.pendingNick = nick;
      await firebase.auth().createUserWithEmailAndPassword(id + ID_DOMAIN, pw);
    } else {
      await firebase.auth().signInWithEmailAndPassword(id + ID_DOMAIN, pw);
    }
  } catch (e) { cloud.pendingNick = ''; say(AUTH_ERR[e.code] || '실패했습니다: ' + e.message); }
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
