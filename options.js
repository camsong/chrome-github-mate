function renderOptions() {
  var config = getConfig();
  document.querySelector('#feature-1-enable').checked = config['feature-1-enable'];
  document.querySelector('#feature-2-enable').checked = config['feature-2-enable'];
  document.querySelector('#feature-2-interval').value = config['feature-2-interval'];
  document.querySelector('#feature-2-type').value = config['feature-2-type'];
  document.querySelector('#feature-3-tab-size').value = config['feature-3-tab-size'] || '4'; // set to 4 by default
  document.querySelector('#feature-4-enable').checked = config['feature-4-enable'];
  renderOptionsStates();
}

function renderOptionsStates() {
  document.querySelector('#feature-2-interval').disabled = !(document.querySelector('#feature-2-enable').checked);
  document.querySelector('#feature-2-type').disabled     = !(document.querySelector('#feature-2-enable').checked);
}

function storeConfig() {
  localStorage.setItem('gm_config', JSON.stringify({
    'feature-1-enable': document.querySelector('#feature-1-enable').checked,
    'feature-2-enable': document.querySelector('#feature-2-enable').checked,
    'feature-2-interval': document.querySelector('#feature-2-interval').value,
    'feature-2-type': document.querySelector('#feature-2-type').value,
    'feature-3-tab-size': document.querySelector('#feature-3-tab-size').value,
    'feature-4-enable': document.querySelector('#feature-4-enable').checked,
  }));
}

window.onload = function() {
  renderOptions();
  document.onchange = function() {
    storeConfig();
    renderOptionsStates();
  };
}
