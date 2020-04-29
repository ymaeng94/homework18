const FILE_TO_CACHE = ["/", "index.html", "service-worker.js", "style.css", "database.js"];
const CACHE_NAME = "static-cache-v13";
const DATA_CACHE_NAME = "data-cache-v8";





   self.addEventListener('install', evt => {
        evt.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                console.log('Your files were pre-cached successfully');
                return cache.addAll(FILE_TO_CACHE);
            })
        );
        self.skipWaiting();
    });





self.addeventlistener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key != CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});





self.addeVENTLISTENER("fetch", function(evt) {
    if(evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request) 
                    .then(response => {
                        if(response.status === 200) {cache.put(evt.request.url, response.clone());}
                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            })
        );
    return;
    }
    evt.responseWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});