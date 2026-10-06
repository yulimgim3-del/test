const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  observer.observe(item);
});

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', opened);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const filterButtons = document.querySelectorAll('.filter-button');
const workCards = document.querySelectorAll('.work-card[data-category]');
const workEmpty = document.querySelector('.work-empty');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', selected);
  });
  let hasMatch = false;
  workCards.forEach((card) => {
    const matches = card.dataset.category === category;
    card.hidden = !matches;
    hasMatch ||= matches;
  });
  workEmpty.hidden = hasMatch;
}));

const detail = document.querySelector('.work-detail');
const detailImage = detail.querySelector('.detail-image');
const detailTitle = detail.querySelector('#detail-title');
const detailType = detail.querySelector('.detail-type');
const detailDescription = detail.querySelector('.detail-description');
const detailFacts = detail.querySelector('.detail-facts');
const detailBack = detail.querySelector('.detail-back');
const detailClose = detail.querySelector('.detail-close');
let activeCard;

function openDetail(card) {
  const previewImages = [...card.querySelectorAll('.image-wrap img')];
  const gallery = card.dataset.gallery?.split('|').filter(Boolean) || [];
  const pdf = card.dataset.pdf;
  const cover = card.dataset.cover || pdf?.replace(/\.pdf$/i, '-cover.png');
  activeCard = card;
  const images = gallery.length || pdf ? [] : previewImages;
  const media = images.map((source) => {
    const image = document.createElement('img');
    image.src = source.src;
    image.alt = source.alt;
    return image;
  });
  gallery.forEach((path, index) => {
    const image = document.createElement('img');
    image.src = path;
    image.alt = `${card.querySelector('h3').textContent} 작업 화면 ${index + 1}`;
    media.push(image);
  });
  if (pdf && cover) {
    const viewer = document.createElement('div');
    viewer.className = 'detail-pdf-wrap';
    const coverImage = document.createElement('img');
    coverImage.className = 'detail-pdf-cover';
    coverImage.src = cover;
    coverImage.alt = `${card.querySelector('h3').textContent} PDF 첫 페이지`;
    const link = document.createElement('a');
    link.className = 'detail-pdf-link';
    link.href = pdf;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = 'PDF 새 탭에서 보기 ↗';
    viewer.append(coverImage, link);
    media.unshift(viewer);
  }
  detailImage.replaceChildren(...media);
  detailImage.classList.toggle('multi', images.length > 1 && !pdf);
  detail.classList.toggle('has-document', Boolean(pdf));
  detailTitle.textContent = card.querySelector('h3').textContent;
  detailType.textContent = card.querySelector('.work-meta p').textContent;
  detailDescription.textContent = card.dataset.description || '김유림의 시선으로 기획하고 제작한 포트폴리오 작업입니다.';
  const factKeys = ['role', 'purpose', 'process', 'result'];
  detailFacts.hidden = !factKeys.some((key) => card.dataset[key]);
  factKeys.forEach((key) => {
    detailFacts.querySelector(`[data-detail="${key}"]`).textContent = card.dataset[key] || '';
  });
  detail.showModal();
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => detail.classList.add('open'));
}

function closeDetail() {
  detail.classList.remove('open');
  const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550;
  setTimeout(() => {
    detail.close();
    document.body.style.overflow = '';
    activeCard?.focus();
  }, delay);
}

workCards.forEach((card) => {
  card.tabIndex = 0;
  const external = Boolean(card.dataset.link);
  card.setAttribute('role', external ? 'link' : 'button');
  card.setAttribute('aria-label', `${card.querySelector('h3').textContent} ${external ? '인스타그램에서 보기' : '상세 보기'}`);
  const activate = () => external
    ? window.open(card.dataset.link, '_blank', 'noopener,noreferrer')
    : openDetail(card);
  card.addEventListener('click', activate);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
});
detailBack.addEventListener('click', closeDetail);
detailClose.addEventListener('click', closeDetail);
detail.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDetail();
});

window.addEventListener('scroll', () => {
  const visual = document.querySelector('.hero-visual');
  if (window.innerWidth > 800 && window.scrollY < window.innerHeight) {
    visual.style.transform = `translateY(${window.scrollY * 0.08}px)`;
  }
}, { passive: true });
