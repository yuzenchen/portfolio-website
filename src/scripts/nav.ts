export function initNav(): void {
  const hamburger = document.querySelector<HTMLElement>('.hamburger');
  const navMenu = document.querySelector<HTMLElement>('.nav-menu');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (!hamburger || !navMenu || !navbar) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');

      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
