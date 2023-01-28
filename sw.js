this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res ||
        fetch(event.request)
          .then(responese => {
            const responeseClone = responese.clone();
            caches.open('def').then(cache => {
              console.log('下载数据',responeseClone.url);
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
const cacheNames = ['def'];
let changes=[
  '/desktop.html',
  '/desktop.js',
  '/desktop.css',
  '/apps/style/about.css',
  '/apps/style/fonts.css',
  '/apps/style/setting.css',
  '/newyear-dark.png',
  '/newyear-light.png',
]
// a
let flag = false;
this.addEventListener('activate', function (event) {
  flag = true;
  console.log('开始更新');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all[keys.map(key => {
        if (!cacheNames.includes(key)) {
          console.log('清除原始版本数据');
          return caches.delete(key);
        }
      })]
    })
  );
  event.waitUntil(
    caches.keys().then(keys => {
      if(keys.includes('def')){
        caches.open('def').then(cc=>{
          cc.keys().then(key=>{
            key.forEach(k => {
              changes.forEach(fi => {
                if(RegExp(fi+'$').test(k.url)){
                  console.log('删除数据',k.url);
                  return cc.delete(k);
                }
              });
            });
          })
        })
      }
    })
  );
  event.waitUntil(
    caches.open('def').then(function (cache) {
			return cache.addAll([
				'newyear-dark.png'
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