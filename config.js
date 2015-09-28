var DEFAULT_CONFIG = {
  'feature-1-enable': true,
  'feature-2-enable': false,
  'feature-2-interval': '5',
  'feature-2-type': 'unread',
};

function mergeObject(destination, source) {
  for (var property in source)
    if (typeof source[property] !== 'undefined' && source[property] !== '') {
      destination[property] = source[property];
    }
  return destination;
}

function getConfig() {
  var config;
  try {
    config = mergeObject(DEFAULT_CONFIG, JSON.parse(localStorage.gm_config || '{}'));
  } catch (e) {
    console.error(e);
    config = DEFAULT_CONFIG;
  }
  return config;
}
