'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "38f8c4fff413873bb5dfe8a1de1c6ca7",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/images/%25C3%2587.JPG": "de03f851f65e71a2f391435006af827b",
"assets/images/%25C3%2596.JPG": "7993e60b3a6836b4898e6ea7db468b43",
"assets/images/%25C3%259C.JPG": "6f1b1155a64971ff6d60aff8574fa9b6",
"assets/images/%25C4%259E.JPG": "50b09a1bc5aff852a4c682b73f475424",
"assets/images/%25C5%259E.JPG": "db3cf8cf7a900edf739b8e1bded09875",
"assets/images/A.JPG": "01ff5d14e0be62db6b38cd8770c5acc3",
"assets/images/B.JPG": "e262b2d277664783bdf027f780bbce45",
"assets/images/C.JPG": "3bb227aee3717d7d86b0db9eab9a702b",
"assets/images/D.JPG": "90d4cfde522219b7a768b75adbdd7869",
"assets/images/E.JPG": "55cc84af2264a75c46193097ef6b46cd",
"assets/images/F.JPG": "0b1cc8911f6e242345ff8b630b154adf",
"assets/images/G.JPG": "fa4f46504d358217d842a56e2a7e3b2f",
"assets/images/H.JPG": "8335031d6bd38ee122aa26d80262748f",
"assets/images/harfler.jpg": "de168ec793b63ec4f8c1ad8622bc081e",
"assets/images/I.JPG": "2cd79ad5c58627555b37d8c32e06e47e",
"assets/images/II.JPG": "02dda4b46f44f09e0c7ca802b9997893",
"assets/images/J.JPG": "3a798459af0deb2fe3d339975cb5a967",
"assets/images/K.JPG": "6e66dcecc827a18de704b4fa7a4383a3",
"assets/images/L.JPG": "8078aa2b7c5a936d935c9a3ca6cef142",
"assets/images/M.JPG": "e7ea7adeb7a6822cf76963f3864c6c21",
"assets/images/N.JPG": "be830ce8e98d5707d51d0920f054f9e0",
"assets/images/O.JPG": "06e863711a4fad76fb01bcf008c6f58f",
"assets/images/P.JPG": "3b92621c237c8384f499166c84eb0e6c",
"assets/images/R.JPG": "963fafa6e8aef361f7314afc9acd3060",
"assets/images/S.JPG": "de76a50444760907fc32592431937b8a",
"assets/images/T.JPG": "6052d8bac505fef7d88943e8e46b392c",
"assets/images/U.JPG": "874f85b99bbfcbd7bf1de67fd83cd875",
"assets/images/V.JPG": "e8351a87020d2784b9454d8fd32888b7",
"assets/images/Y.JPG": "48d1e2cc8b69fb3a3e44f73525412aeb",
"assets/images/Z.JPG": "48fe88d8e28581f0a45e6a55f015f10a",
"assets/NOTICES": "a8d1d130b9909728d724354dc06becc1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "ac4791d2e03fbc834f031ebe96a50346",
"/": "ac4791d2e03fbc834f031ebe96a50346",
"main.dart.js": "92f4102c3087bebcaabf6c5bada89fb0",
"manifest.json": "98e9499c38b52ce26941ced9e19275fb",
"version.json": "b1c459da0a1c139a3c209c51c9c82531"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
