// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';
const urlsToCache = [
  '/Lab7_starter/index.html',
  '/Lab7_starter/favicon.ico',
  '/Lab7_starter/assets',
  '/Lab7_starter/assets/images',
  '/Lab7_starter/assets/images/icons',
  '/Lab7_starter/assets/images/icons/0-star.svg',
  '/Lab7_starter/assets/images/icons/1-star.svg',
  '/Lab7_starter/assets/images/icons/2-star.svg',
  '/Lab7_starter/assets/images/icons/3-star.svg',
  '/Lab7_starter/assets/images/icons/4-star.svg',
  '/Lab7_starter/assets/images/icons/5-star.svg',
  '/Lab7_starter/assets/images/icons/arrow-down.png',
  '/Lab7_starter/assets/styles',
  '/Lab7_starter/assets/styles/main.css',
  '/Lab7_starter/assets/scripts',
  '/Lab7_starter/assets/scripts/main.js',
  '/Lab7_starter/assets/scripts/Router.js',
  '/Lab7_starter/assets/components',
  '/Lab7_starter/assets/components/RecipeCard.js',
  '/Lab7_starter/assets/components/RecipeExpand.js',
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json'
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