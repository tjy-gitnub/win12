let version = 'v3.4.1';
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
let flag = false;
this.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all[keys.map(key => {
        if (!cacheNames.includes(key)) {
          flag = true;
          return caches.delete(key);
        }
      })]
    })
  );
  event.waitUntil(
    caches.open(version).then(function (cache) {
			return cache.addAll([
				'apps/icons/explorer/disk.png',
				'apps/icons/explorer/diskwin.png',
				'apps/icons/explorer/folder.png'
			]);
		})
  );
});

this.addEventListener('message', function (e) {
  if (e.data == 'update?') {
    if (flag) {
      e.source.postMessage('update');
      flag = false;
    }
  }
});