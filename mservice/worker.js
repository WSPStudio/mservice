const CACHE_VERSION = 'v1';
const CACHE_NAME = `site-cache-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
	'/',
	'/index.html',
	'/assets/css/vendor.css',
	'/assets/css/style.css',
	'/assets/js/vendor.js',
	'/assets/js/script.js',
];

// Установка Service Worker и кеширование необходимых файлов
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(ASSETS_TO_CACHE);
		})
	);
	self.skipWaiting();
});

// Активация Service Worker и удаление устаревшего кеша
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(
				keys.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key))
			);
		})
	);
	self.clients.claim();
});

// Перехват запросов и выдача кешированных данных
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request).then(fetchResponse => {
				const clonedResponse = fetchResponse.clone();

				if (event.request.url.endsWith('.svg') || event.request.destination === 'image') {
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, clonedResponse);
					});
				}

				return fetchResponse;
			});
		}).catch(() => caches.match('/index.html'))
	);
});
