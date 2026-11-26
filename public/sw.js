const CACHE_NAME = 'placasegura-v1'
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/placasegura.svg',
  '/icons/placasegura-maskable.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
      self.skipWaiting(),
    ]),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
        keys
          .filter((key) => key.startsWith('placasegura-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
        ),
      ),
      self.clients.claim(),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const requestUrl = new URL(request.url)

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    fetch(request)
      .then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(request, response.clone())
        }
        return response
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request)
        if (cachedResponse) {
          return cachedResponse
        }

        if (request.mode === 'navigate') {
          const appShell = await caches.match('/')
          if (appShell) {
            return appShell
          }
        }

        return Response.error()
      }),
  )
})
