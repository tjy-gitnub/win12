let version='v3.0.0';
this.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(res => {
        return res ||
          fetch(event.request)
            .then(responese => {
              const responeseClone = responese.clone();
              caches.open(version).then(cache => {
                cache.put(event.request, responeseClone);
              })
              return responese;
            })
            .catch(err => {
              console.log(err);
            });
      })
    )
});
const cacheNames = [version];
let flag=false;
this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all[keys.map(key => {
                if (!cacheNames.includes(key)) {
                    setTimeout(() => {
                    this.clients.matchAll().then(client => {
						console.log(client);
						while (true) {
							try{
							client[0].postMessage('update');
							break;
							}catch(TypeError){
							console.log('error');
							}
						}
                    });
                    }, 2000);
                    return caches.delete(key);
                }
            })]
        })
    );
});