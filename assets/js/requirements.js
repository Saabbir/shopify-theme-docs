(function () {
  document.querySelectorAll('#toc-req a').forEach(link => {
    link.addEventListener('click', () => {
      const el = document.getElementById(link.getAttribute('data-id'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sections = document.querySelectorAll('.section, .tldr-box');
  const links    = document.querySelectorAll('#toc-req a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`#toc-req a[data-id="${e.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();
