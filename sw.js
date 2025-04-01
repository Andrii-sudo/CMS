const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
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

// Подія встановлення Service Worker
// Відбувається при першому запуску або коли SW оновлюється
self.addEventListener("install", (event) =>
{
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
        {
            console.log("Кешування ресурсів..."); // логування не обовязкове
            return cache.addAll(ASSETS).catch(console.error);
        })
    );
});

// Подія обробки запитів від клієнта (браузера)
// Якщо файл є в кеші – повертаємо його, інакше робимо запит до мережі
self.addEventListener("fetch", (event) =>
{
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
        {
            return cache.match(event.request).then((cachedResponse) =>
            {
                // Запит до мережі, якщо ресурсу немає в кеші
                const networkFetch = fetch(event.request).then((networkResponse) => {
                    // Зберігаємо отриманий файл у кеш для майбутніх запитів
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });

                // Повертаємо кешовану версію, якщо вона є, інакше робимо запит до мережі
                return cachedResponse || networkFetch;
            });
        })
    );
});

// Подія активації Service Worker
// Видаляє старі кеші, які більше не використовуються
self.addEventListener("activate", (event) =>
{
    event.waitUntil(
        caches.keys().then((keys) =>
        {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME) // Знаходимо старі кеші
                    .map((key) => caches.delete(key))   // Видаляємо їх
            );
        }).then(() =>
        {
            console.log("Новий Service Worker активовано.");
            return self.clients.claim(); // Переключаємо новий SW для всіх вкладок
        })
    );
});