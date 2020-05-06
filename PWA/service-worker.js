// new service worker  
const staticCacheName = 'pages-cache-v1';
  
self.addEventListener('install', (e) => {
    console.log('service worker install successfully')
    e.waitUntil(caches.open(staticCacheName)
        .then(cache => {
            console.log('attempting to cache static files')
            return cache.add('/')
        })
        .catch(err => {
            console.log('error caching static files: ', err)
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (e) => {
    console.log('serviceworker activated successfully')
})

self.addEventListener('fetch', e => {
    console.log('fetching : ', e.request.url);
}) 