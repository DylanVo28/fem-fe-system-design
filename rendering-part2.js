(function() {
    const steps = {
        1: {
            title: '1) Khởi tạo ban đầu (render <html>)',
            bullets: [
                'DOM tree cập nhật.',
                'RenderObject tạo tương ứng.',
                'Tạo root RenderLayer và root GraphicLayer.',
                'Mặc định có stacking context và block formatting context.'
            ],
            highlight: ['html'],
            badges: {
                html: ['fc','sc','rl','gl']
            },
            active: ['html','body']
        },
        2: {
            title: '2) Render <body>',
            bullets: [
                'DOM tree + RenderObject tree cập nhật.',
                'RenderLayer/GraphicLayer không thay đổi.'
            ],
            highlight: ['body'],
            badges: {
                body: ['fc']
            },
            active: ['html','body']
        },
        3: {
            title: '3) Render <section> với flex items',
            bullets: [
                'DOM + RenderObject tree cập nhật.',
                'Không thêm layer nào (vẫn 1 RenderLayer + 1 GraphicLayer).',
                'Tạo flex formatting context.',
                'Các div bên trong trở thành block formatting context (do là flex items).'
            ],
            highlight: ['section-flex'],
            badges: {
                'section-flex': ['fc']
            },
            active: ['html','body','section-flex','flex-item-1','flex-item-2','flex-item-3']
        },
        4: {
            title: '4) Render <span> (absolute position + text)',
            bullets: [
                'DOM + RenderObject tree cập nhật.',
                'Tạo RenderLayer mới (vì absolute).',
                'Tạo stacking context mới (ra khỏi flow gốc).',
                'Trong đó, tạo block formatting context + inline formatting context.'
            ],
            highlight: ['span-abs'],
            badges: {
                'span-abs': ['rl','sc','fc']
            },
            active: ['html','body','section-flex','flex-item-1','flex-item-2','flex-item-3','span-abs']
        },
        5: {
            title: '5) Render <div> với display: inline-block',
            bullets: [
                'DOM + RenderObject tree cập nhật.',
                'Không tạo thêm RenderLayer/GraphicLayer.',
                'Trong root stacking context → tạo block formatting context mới (do inline-block).'
            ],
            highlight: ['div-inline-block'],
            badges: {
                'div-inline-block': ['fc']
            },
            active: ['html','body','section-flex','flex-item-1','flex-item-2','flex-item-3','span-abs','div-inline-block']
        },
        6: {
            title: '6) Render <div> (absolute + 3D transform)',
            bullets: [
                'DOM + RenderObject tree cập nhật.',
                'Tạo RenderLayer mới.',
                'Vì có 3D transform → promote sang GraphicLayer mới.',
                'Đồng thời tạo stacking context mới + formatting context mới.'
            ],
            highlight: ['div-abs-3d'],
            badges: {
                'div-abs-3d': ['rl','sc','gl','fc']
            },
            active: ['html','body','section-flex','flex-item-1','flex-item-2','flex-item-3','span-abs','div-inline-block','div-abs-3d']
        },
        7: {
            title: '7) Kết quả cuối',
            bullets: [
                'Có nhiều stacking context chồng lên nhau (root → stacking1 → stacking2).',
                'Các formatting context (block, flex, inline) được hình thành tùy thuộc vào CSS.',
                'Các RenderLayer và GraphicLayer gắn vào context phù hợp.'
            ],
            highlight: ['html','span-abs','div-abs-3d'],
            badges: {
                html: ['sc','rl','gl'],
                'span-abs': ['sc','rl'],
                'div-abs-3d': ['sc','rl','gl']
            },
            active: ['html','body','section-flex','flex-item-1','flex-item-2','flex-item-3','span-abs','div-inline-block','div-abs-3d']
        }
    };

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const explainTitle = $('#explainTitle');
    const explainBullets = $('#explainBullets');
    const stepLabel = $('#stepLabel');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');

    const quickStepButtons = $$('.chip[data-step]');

    let currentStep = 1;

    // helpers
    function setText(el, text) { el.textContent = text; }
    function clearChildren(el) { while (el.firstChild) el.removeChild(el.firstChild); }

    function getNodeEl(key) {
        return document.querySelector(`[data-node="${key}"]`);
    }

    function removeAllBadges() {
        $$('.badge').forEach(b => b.remove());
    }

    function addBadges(map) {
        Object.entries(map).forEach(([key, badges]) => {
            const el = getNodeEl(key);
            if (!el) return;
            badges.forEach(b => {
                const badge = document.createElement('span');
                badge.className = `badge ${b}`;
                badge.textContent = b.toUpperCase();
                el.appendChild(badge);
            });
        });
    }

    function setActive(nodes) {
        // Mark all nodes as inactive by default
        $$('.node, .inline-text, .inline-block, .abs-3d').forEach(el => el.setAttribute('data-active', 'false'));
        // Activate required nodes
        nodes.forEach(key => {
            const el = getNodeEl(key);
            if (el) el.setAttribute('data-active', 'true');
        });
    }

    function setHighlight(keys) {
        $$('.node, .inline-text, .inline-block, .abs-3d').forEach(el => el.removeAttribute('data-highlight'));
        keys.forEach(key => {
            const el = getNodeEl(key);
            if (el) el.setAttribute('data-highlight', 'true');
        });
    }

    function setBullets(items) {
        clearChildren(explainBullets);
        items.forEach(txt => {
            const li = document.createElement('li');
            li.textContent = txt;
            explainBullets.appendChild(li);
        });
    }

    function updateStepUi() {
        const cfg = steps[currentStep];
        setText(stepLabel, `Bước ${currentStep}/7`);
        setText(explainTitle, cfg.title);
        setBullets(cfg.bullets);
        setActive(cfg.active || []);
        setHighlight(cfg.highlight || []);
        removeAllBadges();
        addBadges(cfg.badges || {});

        prevBtn.disabled = currentStep === 1;
        nextBtn.disabled = currentStep === 7;

        quickStepButtons.forEach(btn => {
            const s = Number(btn.getAttribute('data-step'));
            btn.style.background = s === currentStep ? '#ede9fe' : 'white';
            btn.style.borderColor = s === currentStep ? '#7c3aed' : '#e5e7eb';
            btn.style.color = s === currentStep ? '#7c3aed' : '#111827';
        });
    }

    function go(step) {
        currentStep = Math.max(1, Math.min(7, step));
        updateStepUi();
    }

    prevBtn.addEventListener('click', () => go(currentStep - 1));
    nextBtn.addEventListener('click', () => go(currentStep + 1));
    quickStepButtons.forEach(btn => btn.addEventListener('click', () => go(Number(btn.dataset.step))));

    // Init
    document.addEventListener('DOMContentLoaded', () => {
        go(1);
    });
})(); 