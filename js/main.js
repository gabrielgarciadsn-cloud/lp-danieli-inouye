const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer;
let frame = 0;
const progress = document.createElement('div');
progress.className = 'progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
const wordBlocks = [...document.querySelectorAll('.word-reveal')];
// Keep emphasis and text accessible; each word remains real HTML text.
wordBlocks.forEach(block => {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(word => {
      if (!word.trim()) fragment.append(document.createTextNode(word));
      else { const span = document.createElement('span'); span.className = 'word'; span.textContent = word; fragment.append(span); }
    });
    node.replaceWith(fragment);
  });
});
const images = [...document.querySelectorAll('.parallax')];
const stack = document.querySelector('.hero-stack');
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
function isPaused() { return mediaQuery.matches; }
const pinnedStatement = document.querySelector('.scroll-statement');
const scrollLines = [...document.querySelectorAll('.scroll-line')];
function update() {
  frame = 0;
  const paused = isPaused();
  if (pinnedStatement) {
    const rect = pinnedStatement.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / distance));
    scrollLines.forEach((line, index) => {
      const phase = Math.max(0, Math.min(1, progress * 1.7 - index * .22));
      line.style.setProperty('--line-y', (-100 * (1 - phase)) + '%');
      line.style.setProperty('--line-opacity', String(.2 + phase * .8));
    });
  }
  const height = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--progress', String(height > 0 ? Math.min(1, scrollY / height) : 0));
  if (header && hero) {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    header.classList.toggle('nav-visible', scrollY > heroBottom - 80);
  }
  if (paused) return;
  wordBlocks.forEach(block => {
    const box = block.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (innerHeight * .85 - box.top) / (innerHeight * .6)));
    const words = block.querySelectorAll('.word');
    words.forEach((word, index) => word.classList.toggle('lit', fraction >= index / words.length));
  });
  images.forEach(img => {
    const box = img.parentElement.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return;
    const shift = Math.max(-18, Math.min(18, (innerHeight / 2 - box.top - box.height / 2) * .035));
    img.style.setProperty('--image-shift', shift + 'px');
  });
  if (stack) stack.style.setProperty('--stack-rotate', Math.max(-4, Math.min(3, -4 + scrollY * .008)) + 'deg');
}
function schedule() { if (!frame) frame = requestAnimationFrame(update); }
function configure() {
  if (observer) observer.disconnect();
  const paused = isPaused();
  document.body.classList.toggle('paused', paused);
  if (paused) {
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, {threshold: .12});
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => observer.observe(el));
  }
  schedule();
}
mediaQuery.addEventListener('change', configure);
window.addEventListener('scroll', schedule, {passive:true});
window.addEventListener('resize', schedule, {passive:true});
configure();

// Prepare every image before the scrolling loop enters the viewport.
const marquee = document.querySelector('.testimonial-marquee');
if (marquee) {
  const track = marquee.querySelector('.testimonial-track');
  let ready = false;
  let visible = false;
  const sync = () => track.style.setProperty('animation-play-state', ready && visible && !mediaQuery.matches ? 'running' : 'paused', 'important');
  sync();
  const prepare = async () => {
    const pictures = [...marquee.querySelectorAll('img')];
    pictures.forEach(img => { img.loading = 'eager'; });
    await Promise.allSettled(pictures.map(img => img.decode()));
    ready = true;
    sync();
  };
  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        prepare();
        preload.disconnect();
      }
    }, { rootMargin: '1800px 0px' });
    preload.observe(marquee);
    const visibility = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    });
    visibility.observe(marquee);
  } else {
    visible = true;
    prepare();
  }
  mediaQuery.addEventListener('change', sync);
}

const connections = document.querySelector('.audience-list');
if (connections && 'IntersectionObserver' in window) {
  const connectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('connected-active', entry.isIntersecting);
  }, {threshold: .1});
  connectionObserver.observe(connections);
} else if (connections) connections.classList.add('connected-active');
