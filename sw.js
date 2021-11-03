// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/assets',
  '/assets/images',
  '/assets/images/icons',
  '/assets/images/icons/0-star.svg',
  '/assets/images/icons/1-star.svg',
  '/assets/images/icons/2-star.svg',
  '/assets/images/icons/3-star.svg',
  '/assets/images/icons/4-star.svg',
  '/assets/images/icons/5-star.svg',
  '/assets/images/icons/arrow-down.png',
  '/assets/styles',
  '/assets/styles/main.css',
  '/assets/scripts',
  '/assets/scripts/main.js',
  '/assets/scripts/Router.js',
  '/assets/components',
  '/assets/components/RecipeCard.js',
  '/assets/components/RecipeExpand.js'
];

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(response) {
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});