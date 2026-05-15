const cache = {};

function setCache(key, value, ttl = 60) {
  cache[key] = {
    value,
    expiry: Date.now() + ttl * 1000
  };
}

function getCache(key) {
  const item = cache[key];

  if (!item) return null;

  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }

  return item.value;
}

module.exports = {
  setCache,
  getCache
};