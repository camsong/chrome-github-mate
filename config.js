var DEFAULT_CONFIG = {
  'feature-1-enable': true,
  'feature-2-enable': true,
  'feature-2-interval': '5',
  'feature-2-type': 'participating',
  'feature-4-enable': true,
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
    config = mergeObject(DEFAULT_CONFIG, JSON.parse(localStorage.getItem('gm_config') || '{}'));
  } catch (e) {
    console.error(e);
    config = DEFAULT_CONFIG;
  }
  return config;
}
