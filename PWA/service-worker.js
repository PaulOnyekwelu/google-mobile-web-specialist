// new service worker
self.addEventListener('install', (e) => {
    console.log('service worker install successfully')
    // e.waitUntil(caches.open(cache => {
    //     cache.add('./index.html')
    //         .then(response => {
    //             console.log('index.html successfully added: ', response)
    //         })
    // }))
    self.skipWaiting()
})

self.addEventListener('activate', (e) => {
    console.log('serviceworker activated successfully')
})

self.addEventListener('fetch', e => {
    console.log('fetching : ', e.request.url);
}) 