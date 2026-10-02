(function () {
  'use strict';
  var form = document.getElementById('pilot-form');
  var preview = document.getElementById('brief-preview');
  if (!form || !preview) return;

  function value(name) {
    var field = form.elements[name];
    return field && String(field.value || '').trim() || 'Not answered yet';
  }

  function brief() {
    var existing = Array.prototype.slice.call(form.querySelectorAll('input[name="existing"]:checked')).map(function (item) { return item.value; });
    return [
      'PILOT BRIEF',
      '',
      'Place: ' + value('place'),
      'Audience: ' + value('audience'),
      'Desired change: ' + value('change'),
      'Already in place: ' + (existing.length ? existing.join(', ') : 'Not answered yet'),
      'First constraint: ' + value('constraint'),
      'Reply to: ' + value('reply')
    ].join('\n');
  }

  function render() { preview.textContent = brief(); }
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (event) {
    if (!form.reportValidity()) return;
    event.preventDefault();
    window.location.href = 'mailto:csilvasantin@gmail.com?subject=' + encodeURIComponent('Digital signage pilot brief') + '&body=' + encodeURIComponent(brief());
  });
  render();
}());
