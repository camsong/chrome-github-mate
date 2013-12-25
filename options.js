function renderOptions() {
  var config = getConfig();
  document.querySelector('#feature-1-enable').checked = config['feature-1-enable'];
  document.querySelector('#feature-2-enable').checked = config['feature-2-enable'];
  document.querySelector('#feature-2-interval').value = config['feature-2-interval'];
  renderOptionsStates();
}

function renderOptionsStates() {
  document.querySelector('#feature-2-interval').disabled = !(document.querySelector('#feature-2-enable').checked);
}

function storeConfig() {
  localStorage.gm_config = JSON.stringify({
    'feature-1-enable': document.querySelector('#feature-1-enable').checked,
    'feature-2-enable': document.querySelector('#feature-2-enable').checked,
    'feature-2-interval': document.querySelector('#feature-2-interval').value
  });
}

window.onload = function() {
  renderOptions();
  document.onchange = function() {
    storeConfig();
    renderOptionsStates();
  };
}
