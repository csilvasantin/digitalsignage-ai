(function () {
  'use strict';
  var form = document.getElementById('pilot-form');
  var preview = document.getElementById('brief-preview');
  var status = document.getElementById('pilot-status');
  var consent = document.getElementById('pilot-consent');
  var consentText = document.getElementById('pilot-consent-text');
  if (!form || !preview) return;

  function value(name) {
    var field = form.elements[name];
    return field && String(field.value || '').trim() || '';
  }
  function existing() {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="existing"]:checked')).map(function (item) { return item.value; });
  }
  function brief() {
    var e = existing();
    var or = function (v) { return v || 'Not answered yet'; };
    return ['PILOT BRIEF', '',
      'Place: ' + or(value('place')),
      'Audience: ' + or(value('audience')),
      'Desired change: ' + or(value('change')),
      'Already in place: ' + (e.length ? e.join(', ') : 'Not answered yet'),
      'First constraint: ' + or(value('constraint')),
      'Reply to: ' + or(value('reply'))].join('\n');
  }
  function mailto() {
    return 'mailto:csilvasantin@gmail.com?subject=' + encodeURIComponent('Digital signage pilot brief') + '&body=' + encodeURIComponent(brief());
  }
  function say(text, kind) {
    if (!status) return;
    status.textContent = text;
    status.dataset.kind = kind || '';
  }
  function emailFallback(reason) {
    say(reason + ' ', 'warn');
    var link = document.createElement('a');
    link.href = mailto();
    link.textContent = 'Send the same brief by email instead →';
    status.appendChild(link);
  }

  function render() { preview.textContent = brief(); }
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say('Sending your brief…');
    fetch('/pilot/api/lead', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        place: value('place'), audience: value('audience'), change: value('change'), existing: existing(),
        constraint: value('constraint'), reply: value('reply'), website: value('website'),
        consent: Boolean(consent && consent.checked), consentText: consentText ? consentText.textContent.trim() : '',
        page: window.location.pathname + window.location.search
      })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return {status: r.status, data: d}; }); })
      .then(function (res) {
        if (res.status === 200 && res.data.ok) {
          form.dataset.sent = 'true';
          say('Received. Your brief is saved and a person will reply to ' + value('reply') + '. Reference ' + String(res.data.id).slice(0, 8) + '.', 'ok');
          return;
        }
        button.disabled = false;
        if (res.status === 429) return emailFallback('Too many briefs from this connection in a few minutes.');
        if (res.data.error === 'reply') return say('That reply address does not look right. Check it and send again.', 'warn');
        if (res.data.error === 'consent') return say('Tick the box so we are allowed to keep your brief and answer it.', 'warn');
        emailFallback('We could not save the brief just now.');
      })
      .catch(function () { button.disabled = false; emailFallback('We could not reach the server.'); });
  });
  render();
}());
