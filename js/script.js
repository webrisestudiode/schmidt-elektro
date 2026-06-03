document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Scroll Animations ---
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        animatedEls.forEach(el => observer.observe(el));
    } else {
        animatedEls.forEach(el => el.classList.add('is-visible'));
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptBtn) {
        if (!localStorage.getItem('schmidtCookiesAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1200);
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('schmidtCookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // =============================================
    // --- Multi-step Project Form ---
    // =============================================
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns  = document.querySelectorAll('.btn-next');
    const prevBtns  = document.querySelectorAll('.btn-prev');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressLine   = document.querySelector('.progress-line');
    let currentStep = 0;

    const serviceOptions = document.querySelectorAll('.service-option');
    const serviceInput   = document.getElementById('selected-service');

    if (serviceOptions.length > 0) {
        serviceOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                serviceOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                if (serviceInput) serviceInput.value = opt.dataset.service;
            });
        });
    }

    function updateForm() {
        formSteps.forEach((step, i) => step.classList.toggle('active', i === currentStep));

        stepIndicators.forEach((ind, i) => {
            if (i < currentStep) {
                ind.classList.add('completed');
                ind.classList.remove('active');
                ind.querySelector('.ind-num').innerHTML = '<i class="fa-solid fa-check"></i>';
            } else if (i === currentStep) {
                ind.classList.add('active');
                ind.classList.remove('completed');
                ind.querySelector('.ind-num').textContent = i + 1;
            } else {
                ind.classList.remove('active', 'completed');
                ind.querySelector('.ind-num').textContent = i + 1;
            }
        });

        if (progressLine && stepIndicators.length > 1) {
            const pct = (currentStep / (stepIndicators.length - 1)) * 100;
            progressLine.style.width = `${pct}%`;
        }
    }

    if (nextBtns.length > 0) {
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep === 0 && serviceInput && !serviceInput.value) {
                    alert('Bitte wählen Sie eine Leistung aus.');
                    return;
                }
                currentStep++;
                updateForm();
                document.querySelector('.multi-step-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentStep--;
                updateForm();
                document.querySelector('.multi-step-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // Projekt form submit
    const projektForm = document.getElementById('projekt-anfrage-form');
    if (projektForm) {
        projektForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = projektForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Wird gesendet...';
            btn.disabled = true;
            setTimeout(() => {
                projektForm.innerHTML = `
                    <div class="success-box">
                        <i class="fa-solid fa-circle-check text-success"></i>
                        <h3>Vielen Dank! Wir melden uns innerhalb von 24 Stunden.</h3>
                        <p>Ihre Anfrage wurde erfolgreich übermittelt. Unser Team prüft Ihre Angaben und meldet sich schnellstmöglich bei Ihnen.</p>
                        <a href="index.html" class="btn btn-primary">Zurück zur Startseite</a>
                    </div>`;
            }, 1600);
        });
    }

    // Bewerbungs form submit
    const bewerbungsForm = document.getElementById('bewerbungs-form');
    if (bewerbungsForm) {
        bewerbungsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bewerbungsForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Wird gesendet...';
            btn.disabled = true;
            setTimeout(() => {
                bewerbungsForm.innerHTML = `
                    <div class="success-box">
                        <i class="fa-solid fa-circle-check text-success"></i>
                        <h3>Vielen Dank für Ihre Bewerbung!</h3>
                        <p>Wir freuen uns auf Ihre Mitarbeit und melden uns in Kürze bei Ihnen.</p>
                    </div>`;
            }, 1600);
        });
    }

    // File upload labels
    document.querySelectorAll('.file-upload-wrap').forEach(wrap => {
        const input = wrap.querySelector('input[type="file"]');
        const label = wrap.querySelector('.file-label');
        if (input && label) {
            input.addEventListener('change', () => {
                const name = input.files[0]?.name || 'Keine Datei ausgewählt';
                label.textContent = name;
            });
        }
        wrap.addEventListener('click', () => input && input.click());
    });

});

// ========================
// Firma Name Replacement
// ========================
(function () {
  var params = new URLSearchParams(window.location.search);
  var firma = params.get('firma');
  if (!firma) return;

  var demoNames = [
    'Schmidt Elektro München',
    'Schmidt Elektro',
    'SchmidtElektro',
  ];

  function replaceText(node, oldStr, newStr) {
    if (node.nodeType === 3) {
      if (node.textContent.indexOf(oldStr) !== -1)
        node.textContent = node.textContent.split(oldStr).join(newStr);
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (var i = 0; i < node.childNodes.length; i++)
        replaceText(node.childNodes[i], oldStr, newStr);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    demoNames.forEach(function (n) {
      replaceText(document.body, n, firma);
    });
    document.title = demoNames.reduce(function (t, n) { return t.split(n).join(firma); }, document.title);
  });
})();
