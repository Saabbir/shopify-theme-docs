// Makes GFM task-list checkboxes (rendered disabled by default) interactive:
// - click to check/uncheck
// - checked items get struck through
// - state persists per-page in localStorage
// - a progress bar is injected above each checklist group
(function () {
  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60);
  }

  function init() {
    var root = document.querySelector('.sl-markdown-content');
    if (!root) return;

    var checkboxes = root.querySelectorAll('li > input[type="checkbox"]');
    if (!checkboxes.length) return;

    var pathname = window.location.pathname;

    // Group checkboxes by their containing <ul>, in document order.
    var groups = [];
    var groupByUl = new Map();
    checkboxes.forEach(function (cb) {
      var li = cb.parentElement;
      var ul = li.parentElement;
      var group = groupByUl.get(ul);
      if (!group) {
        group = { ul: ul, items: [] };
        groupByUl.set(ul, group);
        groups.push(group);
      }
      group.items.push({ cb: cb, li: li });
    });

    groups.forEach(function (group, groupIndex) {
      // Don't double-inject if this ran twice on the same DOM (defensive only).
      var prev = group.ul.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('checklist-progress')) {
        return;
      }

      var bar = document.createElement('div');
      bar.className = 'checklist-progress';
      bar.innerHTML =
        '<div class="checklist-progress__track"><div class="checklist-progress__fill"></div></div>' +
        '<span class="checklist-progress__label" aria-live="polite"></span>';
      group.ul.parentNode.insertBefore(bar, group.ul);

      var fill = bar.querySelector('.checklist-progress__fill');
      var label = bar.querySelector('.checklist-progress__label');

      function update() {
        var total = group.items.length;
        var checked = group.items.filter(function (it) {
          return it.cb.checked;
        }).length;
        var pct = total ? Math.round((checked / total) * 100) : 0;
        fill.style.width = pct + '%';
        label.textContent = checked + ' / ' + total + ' complete';
        bar.classList.toggle('checklist-progress--complete', total > 0 && checked === total);
      }

      group.items.forEach(function (item, itemIndex) {
        var key =
          'checklist:' +
          pathname +
          ':' +
          groupIndex +
          ':' +
          itemIndex +
          ':' +
          slugify(item.li.textContent);

        item.cb.disabled = false;
        item.cb.classList.add('checklist-checkbox');
        item.li.classList.add('checklist-item');

        var saved;
        try {
          saved = localStorage.getItem(key);
        } catch (e) {
          saved = null;
        }
        if (saved === '1') {
          item.cb.checked = true;
          item.li.classList.add('checklist-item--checked');
        }

        function applyState() {
          item.li.classList.toggle('checklist-item--checked', item.cb.checked);
          try {
            localStorage.setItem(key, item.cb.checked ? '1' : '0');
          } catch (e) {
            // localStorage unavailable (private browsing, quota) — state just won't persist.
          }
          update();
        }

        // Fires for a direct click on the checkbox itself, and for keyboard
        // toggling (Space) once it's focused.
        item.cb.addEventListener('change', applyState);

        // Make the whole list item clickable, not just the small checkbox
        // square, without double-toggling when the checkbox itself is the
        // click target (that click already fires its own 'change' event
        // above) and without hijacking clicks on a link inside the item.
        item.li.addEventListener('click', function (event) {
          if (event.target === item.cb) return;
          if (event.target.closest && event.target.closest('a')) return;
          event.preventDefault();
          item.cb.checked = !item.cb.checked;
          applyState();
        });
      });

      update();
    });
  }

  // Covers both a plain full page load and an Astro view-transition navigation,
  // whichever this site ends up using.
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:page-load', init);
})();
