/**
 * Basic Cache implementation
 * @param {Event} event - Worker Event
 */
const basic_cache = async event => {
  // cache time set to 900 seconds
  const cache_time = 900;
  let cache = caches.default;
  let response = await cache.match(event.request);
  // force cache time, disable apps, minify
  if (!response) {
    response = await fetch(event.request, {
      cf: {
        cacheTtlByStatus: {
          "200-299": cache_time,
          404: 1,
          "500-599": -1
        },
        apps: false,
        minify: {
          javascript: true,
          css: true,
          html: true
        }
      }
    });
    event.waitUntil(cache.put(event.request, response.clone()));
  }
  return response;
};

addEventListener("fetch", event => event.respondWith(basic_cache(event)));
