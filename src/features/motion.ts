import { $$ } from '../components/util';

/** Wrap each word in a masked span for a staggered rise. Keeps inline children (<em>) intact. */
export function splitWords(el: HTMLElement): void {
  let n = 0;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE) {
        // keep leading punctuation (e.g. the full stop after an <em>) glued to the previous word so it can never wrap alone
        const prev = c.previousSibling as HTMLElement | null;
        const lead = /^[.,;:!?)\u2026]+/.exec(c.textContent ?? '');
        if (lead && prev?.nodeType === Node.ELEMENT_NODE) {
          const last = Array.from(prev.querySelectorAll('.sw-i')).pop();
          if (last) { last.append(lead[0]); c.textContent = (c.textContent ?? '').slice(lead[0].length); }
        }
        const frag = document.createDocumentFragment();
        (c.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const o = document.createElement('span'), i = document.createElement('span');
          o.className = 'sw'; i.className = 'sw-i'; i.textContent = part; i.style.setProperty('--w', String(n++));
          o.appendChild(i); frag.appendChild(o);
        });
        c.replaceWith(frag);
      } else if ((c as HTMLElement).tagName !== 'BR') walk(c);
    });
  };
  walk(el);
  el.classList.add('is-split');
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  el.querySelectorAll('.sw').forEach((s) => s.setAttribute('aria-hidden', 'true'));
}

/**
 * One observer drives every reveal on the page: headline splits, cards, curtains,
 * architecture tracks and the ambient section lighting. Simultaneous entries are staggered.
 */
export function initMotion(root: ParentNode = document): void {
  const heads = $$('[data-split]:not(.is-split)', root).filter((el) => !el.dataset.motion);
  const others = $$('[data-reveal], [data-curtain], [data-arch], .section', root).filter((el) => !el.dataset.motion);
  [...heads, ...others].forEach((el) => (el.dataset.motion = '1'));
  if (!('IntersectionObserver' in window)) { [...heads, ...others].forEach((el) => el.classList.add('is-in', 'is-lit')); return; }

  const io = new IntersectionObserver((entries) => {
    let k = 0;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      if (el.classList.contains('section')) { el.classList.add('is-lit'); io.unobserve(el); return; }
      if (!el.style.getPropertyValue('--d') && !el.hasAttribute('data-split')) el.style.setProperty('--d', `${Math.min(k++, 6) * 70}ms`);
      el.classList.add('is-in'); io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  others.forEach((el) => io.observe(el));

  // Headlines: split above-the-fold ones now (no flash), the rest just before they scroll into range.
  const lazy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    lazy.unobserve(e.target); splitWords(e.target as HTMLElement); io.observe(e.target);
  }), { rootMargin: '0px 0px 150% 0px' });
  heads.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight * 1.3) { splitWords(el); io.observe(el); } else lazy.observe(el); });
}
