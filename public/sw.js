const CACHE_NAME = 'usaidizi-pap-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                return new Response('Offline', { status: 404 });
            });
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-usaidizi-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_TRIGGERED' });
    });
}