// 서비스 워커: 항상 네트워크에서 최신 파일을 먼저 받고, 오프라인일 때만 저장해 둔 파일 사용
// 업데이트할 때 index.html 의 ?v= 숫자와 함께 CACHE 이름도 올려 주세요
const CACHE = 'jh-stock-v31';
const CORE = ['./', 'index.html', 'style.css?v=31', 'app.js?v=31', 'stocks-data.js?v=31', 'firebase-config.js?v=31', 'cloud.js?v=31', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // 같은 사이트의 GET 요청만 처리 (종목 로고 등 외부 이미지는 브라우저에 맡김)
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    // cache: 'no-cache' → 브라우저 HTTP 캐시에 남은 옛 파일 대신 서버에 새 버전이 있는지 확인
    fetch(req, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
