const CACHE_NAME = "pwa-cache-v1";
const ASSETS = 
[
    "/students.html",
    "/messages.html",
    "/dashboard.html",
    "/tasks.html",
    "/styles/all.min.css",
    "/styles/header.css",
    "/styles/navbar.css",
    "/styles/students.css",
    "/scripts/header.js",
    "/scripts/navbar.js",
    "/scripts/students.js",
    "/images/icon-128.png",
    "/images/icon-192.png",
    "/images/icon-256.png",
    "/images/icon-512.png",
    "/images/myPhoto.webp",
    "/images/userPhoto.webp",
    "/webfonts/fa-brands-400.woff2",
    "/webfonts/fa-regular-400.woff2",
    "/webfonts/fa-solid-900.woff2"
];

self.addEventListener("install", (event) =>
{
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
        {
            console.log("Кешування ресурсів...");
            return cache.addAll(ASSETS).catch(console.error);
        })
    );
});

self.addEventListener("fetch", (event) =>
{
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
        {
            return cache.match(event.request).then((cachedResponse) =>
            {
                const networkFetch = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });

                return cachedResponse || networkFetch;
            });
        })
    );
});

self.addEventListener("activate", (event) =>
{
    event.waitUntil(
        caches.keys().then((keys) =>
        {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() =>
        {
            console.log("Новий Service Worker активовано.");
            return self.clients.claim();
        })
    );
});
