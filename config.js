var DEFAULT_CONFIG = {
  'feature-1-enable': true,
  'feature-2-enable': true,
  'feature-2-interval': '5'
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
    config = mergeObject(DEFAULT_CONFIG, JSON.parse(localStorage.gm_config));
  } catch (e) {
    config = DEFAULT_CONFIG;
  }
  localStorage.gm_config = JSON.stringify(config);
  return config;
}
