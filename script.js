'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initScrollReveal();
    initActiveNavLinks();
    initProjectFilters();
    initGalleryFilters();
    initGalleryNav();
    initLightbox();
    initContactForm();
    initScrollTop();
    initSmoothScroll();
});

function initNavbar(){
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initHamburger(){
    const btn   = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');

    btn.addEventListener('click', () => {
        const open = btn.classList.toggle('open');
        links.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            links.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !links.contains(e.target)){
            btn.classList.remove('open');
            links.classList.remove('open');
        }
    });
}

function initScrollReveal(){
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting){
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => observer.observe(el));
}

function initActiveNavLinks(){
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting){
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(sec => observer.observe(sec));
}

function initProjectFilters(){
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (show){
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

function initGalleryFilters(){
    const gFilterBtns  = document.querySelectorAll('.gfilter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    gFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.gfilter;
            let visibleIdx = 0;

            galleryItems.forEach((item) => {
                const show = filter === 'all' || item.dataset.gcategory === filter;
                if (show){
                    item.classList.remove('hidden');
                    const delay = visibleIdx * 60;
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, delay);
                    visibleIdx++;
                } else {
                    item.classList.add('hidden');
                }
            });

            updateGalleryNav();
        });
    });
}

let galleryCurrentPage = 0;
const GALLERY_PAGE_SIZE = 8;

function initGalleryNav(){
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    prevBtn.addEventListener('click', () => navigateGallery(-1));
    nextBtn.addEventListener('click', () => navigateGallery(1));
    updateGalleryNav();
}

function navigateGallery(dir){
    const items = getVisibleGalleryItems();
    if (!items.length) return;

    const total = items.length;
    galleryCurrentPage = ((galleryCurrentPage + dir) + total) % total;

    items.forEach((item, i) => {
        item.style.outline = 'none';
    });

    const focused = items[galleryCurrentPage];
    focused.style.outline = `2px solid var(--accent)`;
    focused.style.outlineOffset = '3px';
    focused.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    updateGalleryNav();
}

function getVisibleGalleryItems(){
    return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

function updateGalleryNav(){
    const items = getVisibleGalleryItems();
    const info  = document.getElementById('galleryInfo');
    if (info){
        galleryCurrentPage = Math.min(galleryCurrentPage, Math.max(0, items.length - 1));
        info.textContent = items.length > 0 ? `${galleryCurrentPage + 1} / ${items.length}` : '0 / 0';
    }
}

const galleryData = [
    { label: 'Dev Workspace',        category: 'Workspace', icon: 'fa-laptop-code',    bg: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
    { label: 'Server Infrastructure', category: 'Tech',      icon: 'fa-server',          bg: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' },
    { label: 'Engineering Team',     category: 'Team',      icon: 'fa-users-gear',      bg: 'linear-gradient(135deg,#003333,#006655)' },
    { label: 'AI Research',          category: 'Tech',      icon: 'fa-microchip',       bg: 'linear-gradient(135deg,#1a0533,#3d005e)' },
    { label: 'Creative Studio',      category: 'Workspace', icon: 'fa-mug-hot',         bg: 'linear-gradient(135deg,#1a0a00,#3d1200)' },
    { label: 'Strategy Sessions',    category: 'Team',      icon: 'fa-chalkboard-user', bg: 'linear-gradient(135deg,#0a0a2e,#1a1a5e)' },
    { label: 'Code Reviews',         category: 'Tech',      icon: 'fa-terminal',        bg: 'linear-gradient(135deg,#002211,#005533)' },
    { label: 'Design Lab',           category: 'Workspace', icon: 'fa-pen-nib',         bg: 'linear-gradient(135deg,#220022,#440044)' },
];

let lbCurrentIndex = 0;

function initLightbox(){
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lbClose');
    const prevBtn  = document.getElementById('lbPrev');
    const nextBtn  = document.getElementById('lbNext');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index, 10);
            openLightbox(idx);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', () => lbNavigate(-1));
    nextBtn.addEventListener('click', () => lbNavigate(1));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  lbNavigate(-1);
        if (e.key === 'ArrowRight') lbNavigate(1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) lbNavigate(dx < 0 ? 1 : -1);
    });
}

function openLightbox(index){
    lbCurrentIndex = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(){
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lbNavigate(dir){
    lbCurrentIndex = ((lbCurrentIndex + dir) + galleryData.length) % galleryData.length;
    renderLightbox();
}

function renderLightbox(){
    const data    = galleryData[lbCurrentIndex];
    const content = document.getElementById('lbContent');
    const counter = document.getElementById('lbCounter');

    content.style.opacity = '0';
    setTimeout(() => {
        content.innerHTML = `
            <div class="lb-inner" style="background:${data.bg}">
                <i class="fa-solid ${data.icon} lb-icon"></i>
                <div class="lb-name">${data.label}</div>
                <div class="lb-cat">${data.category}</div>
            </div>`;
        content.style.opacity = '1';
    }, 150);

    counter.textContent = `${lbCurrentIndex + 1} / ${galleryData.length}`;
}

function initContactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()){
            submitForm();
        }
    });

    ['name','email','message'].forEach(id => {
        const input = document.getElementById(id);
        if (input){
            input.addEventListener('input', () => clearError(id));
        }
    });
}

function validateForm(){
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    if (!name.value.trim()){
        showError('name', 'Please enter your full name.');
        valid = false;
    }

    if (!email.value.trim()){
        showError('email', 'Please enter your email address.');
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
        showError('email', 'Please enter a valid email address.');
        valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10){
        showError('message', 'Please enter a message (at least 10 characters).');
        valid = false;
    }

    return valid;
}

function showError(id, msg){
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) input.classList.add('error');
    if (error) error.textContent = msg;
}

function clearError(id){
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
}

function submitForm(){
    const btn     = document.querySelector('#contactForm .btn-primary');
    const success = document.getElementById('formSuccess');

    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    setTimeout(() => {
        btn.style.display = 'none';
        success.classList.add('show');
        document.getElementById('contactForm').reset();
        setTimeout(() => {
            btn.style.display = '';
            btn.disabled = false;
            btn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
            success.classList.remove('show');
        }, 5000);
    }, 1400);
}

function initSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target){
                e.preventDefault();
                const offset = 80;
                const top    = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

function scrollToSection(id){
    const target = document.getElementById(id);
    if (target){
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}