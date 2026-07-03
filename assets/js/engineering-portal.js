/* engineering-portal.js — page-specific behavior for the Engineering Portal.
   Theme, mobile nav, scrollspy, search, back-to-top, print, and deep-link flash
   are all handled generically by assets/js/site.js. */
(function () {
  'use strict';

  /* ── COLLAPSE / EXPAND ── */
  document.querySelectorAll('.collapse-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var section = btn.closest('.section');
      section.classList.toggle('collapsed');
    });
  });

  function setAllCollapsed(collapsed) {
    document.querySelectorAll('.section').forEach(function (s) { s.classList.toggle('collapsed', collapsed); });
  }
  var expandAllBtn = document.getElementById('expand-all-btn');
  var collapseAllBtn = document.getElementById('collapse-all-btn');
  if (expandAllBtn) expandAllBtn.addEventListener('click', function () { setAllCollapsed(false); });
  if (collapseAllBtn) collapseAllBtn.addEventListener('click', function () { setAllCollapsed(true); });

  /* ── CHECKLISTS: progress + persistence ── */
  var CHECK_KEY = 'eng-portal-checks';
  var checkState = {};
  try { checkState = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); } catch (e) { checkState = {}; }

  function checklistIdFor(cb) {
    var section = cb.closest('.section');
    var idx = Array.prototype.indexOf.call(cb.closest('.check-list').querySelectorAll('input[type=checkbox]'), cb);
    return (section ? section.id : 'x') + '__' + idx;
  }

  document.querySelectorAll('.check-item input[type=checkbox]').forEach(function (cb) {
    var key = checklistIdFor(cb);
    if (checkState[key]) { cb.checked = true; cb.closest('.check-item').classList.add('checked'); }
    cb.addEventListener('change', function () {
      checkState[key] = cb.checked;
      localStorage.setItem(CHECK_KEY, JSON.stringify(checkState));
      cb.closest('.check-item').classList.toggle('checked', cb.checked);
      updateSectionProgress(cb.closest('.section'));
      updateGlobalProgress();
    });
  });

  function updateSectionProgress(section) {
    if (!section) return;
    var boxes = section.querySelectorAll('.check-item input[type=checkbox]');
    if (!boxes.length) return;
    var checked = section.querySelectorAll('.check-item input[type=checkbox]:checked').length;
    var link = document.querySelector('#sidebar .toc-nav a[data-id="' + section.id + '"]');
    if (link) {
      var badge = link.querySelector('.sec-progress');
      if (!badge) { badge = document.createElement('span'); badge.className = 'sec-progress'; link.appendChild(badge); }
      badge.textContent = checked === boxes.length ? '✓' : (checked > 0 ? checked + '/' + boxes.length : '');
    }
  }

  function updateGlobalProgress() {
    var boxes = document.querySelectorAll('.check-item input[type=checkbox]');
    var checked = document.querySelectorAll('.check-item input[type=checkbox]:checked').length;
    var pct = boxes.length ? Math.round((checked / boxes.length) * 100) : 0;
    var bar = document.getElementById('global-bar');
    var pctLabel = document.getElementById('global-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctLabel) pctLabel.textContent = pct + '%';
  }

  document.querySelectorAll('.section').forEach(updateSectionProgress);
  updateGlobalProgress();

  var resetBtn = document.getElementById('reset-checks-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!window.confirm('Reset all checklist progress across the portal?')) return;
      checkState = {};
      localStorage.removeItem(CHECK_KEY);
      document.querySelectorAll('.check-item input[type=checkbox]').forEach(function (cb) {
        cb.checked = false;
        cb.closest('.check-item').classList.remove('checked');
      });
      document.querySelectorAll('.section').forEach(updateSectionProgress);
      updateGlobalProgress();
    });
  }
}());
