const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1')
  await cache.addAll(resources)
}

// Intersect request and answer with cache when possible
const putInCache = async (request, response) => {
  // Skip caching requests with 'chrome-extension' scheme
  if (request.url.startsWith('chrome-extension://')) {
    console.warn('Skipping cache for chrome-extension URL:', request.url)
    return
  }

  const cache = await caches.open('v1')
  await cache.put(request, response)
}

const cacheFirst = async ({
  request,
  preloadResponsePromise,
  fallbackUrl,
  event,
}) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    console.info('using preload response', preloadResponse)
    event.waitUntil(putInCache(request, preloadResponse.clone()))
    return preloadResponse
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request)
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    event.waitUntil(putInCache(request, responseFromNetwork.clone()))
    return responseFromNetwork
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl)
    if (fallbackResponse) {
      return fallbackResponse
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

// Enable navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

const deleteCache = async (key) => {
  await caches.delete(key)
}

const deleteOldCaches = async () => {
  const cacheKeepList = ['v1']
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}

// Activation and cleaning of old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    enableNavigationPreload(),
    deleteOldCaches()
  ]));
});

// Instalation and files caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/src/index.css',
      '/src/App.css',
      '/linkorg.ico',
      '/manifest.json',
      '/offline.html',
      '/linkorg.webp',
      '/src/main.tsx',
      '/src/App.tsx',
    ])
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/offline.html',
      event,
    })
  )
})
