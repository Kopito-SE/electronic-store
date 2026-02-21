// script.js – smooth scroll for anchor links (if any) and any future interactions
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.category-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only smooth scroll if it's an anchor link on the same page
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
      // otherwise, let the browser navigate normally
    });
  });
});