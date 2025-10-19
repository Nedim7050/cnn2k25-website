// ===========================================
// CNN 2K25 - Alice in Wonderland Theme
// JavaScript for Animations & Interactions
// ===========================================

// ===========================================
// Mobile Navigation Toggle & Visibility Force
// ===========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Force mobile visibility function
function forceMobileVisibility() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('📱 Mobile detected - forcing visibility');
        
        // Force form visibility
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.style.display = 'block';
            formSection.style.visibility = 'visible';
            formSection.style.opacity = '1';
            
            // Force all form children visibility
            const formElements = formSection.querySelectorAll('*');
            formElements.forEach(element => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                if (element.classList.contains('character-grid') || element.classList.contains('alumni-character-grid')) {
                    element.style.display = 'grid';
                } else if (element.classList.contains('signature-buttons')) {
                    element.style.display = 'flex';
                } else if (element.tagName !== 'IMG') {
                    element.style.display = 'block';
                }
            });
        }
        
        // Force gallery visibility
        const wonderlandWorld = document.querySelector('.wonderland-world');
        if (wonderlandWorld) {
            wonderlandWorld.style.display = 'block';
            wonderlandWorld.style.visibility = 'visible';
            wonderlandWorld.style.opacity = '1';
            
            // Force all gallery children visibility
            const galleryElements = wonderlandWorld.querySelectorAll('*');
            galleryElements.forEach(element => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                if (element.classList.contains('wonderland-grid')) {
                    element.style.display = 'grid';
                } else if (element.classList.contains('stats-container') || element.classList.contains('signature-buttons')) {
                    element.style.display = 'flex';
                } else {
                    element.style.display = 'block';
                }
            });
        }
        
        console.log('✅ Mobile visibility forced');
    }
}

// Initialize mobile visibility on load and resize
document.addEventListener('DOMContentLoaded', function() {
    forceMobileVisibility();
});

window.addEventListener('resize', function() {
    forceMobileVisibility();
});

// ===========================================
// Smooth Scroll Animation
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================================
// Scroll-triggered Fade-in Animations
// ===========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-on-scroll class
const fadeElements = document.querySelectorAll('.fade-on-scroll');
fadeElements.forEach(element => {
    observer.observe(element);
});

// ===========================================
// Navbar Background on Scroll
// ===========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background opacity based on scroll
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===========================================
// Floating Elements Animation Enhancement
// ===========================================
const floatingElements = document.querySelectorAll('.floating-card, .clock, .teacup, .key');

floatingElements.forEach((element, index) => {
    // Add random movement on mousemove
    document.addEventListener('mousemove', (e) => {
        const speed = 0.02 + (index * 0.01);
        const x = (e.clientX * speed) - (window.innerWidth * speed / 2);
        const y = (e.clientY * speed) - (window.innerHeight * speed / 2);
        
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===========================================
// Form Validation & Submission avec Google Sheets
// ===========================================
const registrationForm = document.getElementById('registrationForm');
const successModal = document.getElementById('successModal');

        // ⚠️ IMPORTANT : URL Apps Script mise à jour
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9RFhp_OrZfXxgxq7wn79EE8PbU4bhxKcyEp8s8nlkHYBCnTEEoX68KQGAPg5QTHmD/exec';

if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Désactiver le bouton
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        
        // Créer et afficher l'overlay de chargement
        showLoadingOverlay();
        
        try {
            // Gérer l'upload de photo
            let photoData = null;
            let photoName = 'Pas de photo';
            
            const photoInput = document.getElementById('photoUpload');
            if (photoInput && photoInput.files && photoInput.files[0]) {
                const file = photoInput.files[0];
                photoName = file.name;
                
                // Convertir l'image en base64
                updateLoadingMessage('📸 Preparing your magical portrait...', 'Converting your photo to wonderland format...');
                photoData = await fileToBase64(file);
                
                await sleep(500); // Petite pause pour que l'utilisateur voie le message
            } else {
                updateLoadingMessage('✨ Gathering your information...', 'Preparing your entry to Wonderland...');
                await sleep(500);
            }
            
            // Vérifier la signature digitale
            if (window.regularHasSignature && !window.regularHasSignature()) {
                hideLoadingOverlay();
                alert('⚠️ Please provide your digital signature before submitting.');
                submitButton.disabled = false;
                return;
            }
            
            // Sauvegarder la signature si nécessaire
            if (window.regularSaveSignature) {
                window.regularSaveSignature();
            }
            
            // Mettre à jour la position combinée avant soumission
            const aiesecPositionSelect = document.getElementById('aiesecPosition');
            const aiesecDepartmentSelect = document.getElementById('aiesecDepartment');
            const aiesecPositionCombined = document.getElementById('aiesecPositionCombined');
            
            if (aiesecPositionSelect && aiesecPositionCombined) {
                const position = aiesecPositionSelect.value;
                const department = aiesecDepartmentSelect?.value || '';
                
                if (position === 'LCP') {
                    aiesecPositionCombined.value = 'LCP';
                } else if (position && department) {
                    aiesecPositionCombined.value = `${position} - ${department}`;
                } else {
                    aiesecPositionCombined.value = position;
                }
            }
            
            const signatureData = document.getElementById('signatureData')?.value || '';
            
            // Récupérer toutes les valeurs du formulaire
            const formData = {
                fullName: document.getElementById('fullName').value,
                aiesecPosition: document.getElementById('aiesecPositionCombined').value || document.getElementById('aiesecPosition').value,
                aiesecDepartment: document.getElementById('aiesecDepartment')?.value || '',
                cin: document.getElementById('cin').value,
                university: document.getElementById('university').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                emergencyPhone: document.getElementById('emergencyPhone').value,
                gender: document.querySelector('input[name="gender"]:checked')?.value || '',
                genderOther: document.querySelector('input[name="genderOther"]')?.value || '',
                dateOfBirth: document.getElementById('dateOfBirth').value,
                allergies: document.querySelector('input[name="allergies"]:checked')?.value || '',
                medicalConditions: document.querySelector('input[name="medicalConditions"]:checked')?.value || '',
                medicalConditionsOther: document.querySelector('textarea[name="medicalConditionsOther"]')?.value || '',
                wonderlandCharacter: document.querySelector('input[name="wonderlandCharacter"]:checked')?.value || '',
                mainGoals: document.getElementById('mainGoals').value,
                interestedTopics: document.getElementById('interestedTopics').value,
                teamSupport: document.getElementById('teamSupport')?.value || '',
                communicationMethod: document.querySelector('input[name="communicationMethod"]:checked')?.value || '',
                communicationMethodOther: document.querySelector('input[name="communicationMethodOther"]')?.value || '',
                photoData: photoData,  // Base64 de la photo
                photoName: photoName,  // Nom du fichier
                finalComments: document.getElementById('finalComments')?.value || '',
                singleRoom: document.querySelector('input[name="singleRoom"]:checked')?.value || '',
                busTransport: document.querySelector('input[name="busTransport"]:checked')?.value || '',
                signatureData: signatureData,  // Signature digitale
                terms: document.getElementById('terms').checked,
                formType: 'regular',
                isAlumni: false
            };
            
            // Valider les termes et conditions
            if (!formData.terms) {
                hideLoadingOverlay();
                alert('⚠️ Veuillez accepter les termes et conditions pour continuer.');
                submitButton.disabled = false;
                return;
            }
            
            // Envoyer les données
            updateLoadingMessage('🐰 Following the White Rabbit...', 'Sending your registration to Wonderland...');
            
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important pour Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Note : avec mode 'no-cors', on ne peut pas lire la réponse
            // On suppose que ça a fonctionné si pas d'erreur
            console.log('✅ Inscription envoyée avec succès!', formData);
            
            // Message de succès final
            updateLoadingMessage('🎉 Welcome to Wonderland!', 'Your registration has been received successfully!');
            await sleep(1500);
            
            // Masquer l'overlay
            hideLoadingOverlay();
            
            // Afficher le modal de succès
            if (successModal) {
                successModal.classList.add('show');
                
                // Réinitialiser le formulaire
                registrationForm.reset();
                
                // Ajouter l'effet confetti
                createConfetti();
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi:', error);
            hideLoadingOverlay();
            alert('⚠️ Une erreur est survenue. Veuillez réessayer ou contacter l\'équipe OC.');
        } finally {
            // Restaurer le bouton
            submitButton.disabled = false;
        }
    });
    
    // Fonction pour convertir un fichier en base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // Fonction pour créer et afficher l'overlay de chargement
    function showLoadingOverlay() {
        // Créer l'overlay s'il n'existe pas déjà
        let overlay = document.getElementById('wonderlandLoadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'wonderlandLoadingOverlay';
            overlay.innerHTML = `
                <div class="wonderland-loading-container">
                    <div class="wonderland-spinner">
                        <div class="rabbit-icon">🐰</div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring-2"></div>
                    </div>
                    <h3 class="loading-title" id="loadingTitle">Opening the portal to Wonderland...</h3>
                    <p class="loading-subtitle" id="loadingSubtitle">Please wait while we process your registration</p>
                    <div class="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            
            // Ajouter les styles
            const style = document.createElement('style');
            style.textContent = `
                #wonderlandLoadingOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                .wonderland-loading-container {
                    text-align: center;
                    padding: 2rem;
                }
                
                .wonderland-spinner {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 2rem;
                }
                
                .rabbit-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    animation: bounce 1s ease-in-out infinite;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -60%) scale(1.1); }
                }
                
                .spinner-ring, .spinner-ring-2 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 3px solid transparent;
                    border-top-color: #fbbf24;
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite;
                }
                
                .spinner-ring-2 {
                    border-top-color: #f59e0b;
                    animation: spin 2s linear infinite reverse;
                    opacity: 0.5;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .loading-title {
                    font-size: 1.8rem;
                    color: #fbbf24;
                    margin-bottom: 0.5rem;
                    font-family: 'Cinzel', serif;
                    text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
                    animation: glow 2s ease-in-out infinite;
                }
                
                @keyframes glow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .loading-subtitle {
                    font-size: 1rem;
                    color: #cbd5e1;
                    margin-bottom: 1.5rem;
                }
                
                .loading-dots {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .loading-dots span {
                    width: 10px;
                    height: 10px;
                    background: #fbbf24;
                    border-radius: 50%;
                    animation: dotPulse 1.4s ease-in-out infinite;
                }
                
                .loading-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .loading-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes dotPulse {
                    0%, 80%, 100% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                    40% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(overlay);
        }
        
        overlay.style.display = 'flex';
    }
    
    // Fonction pour masquer l'overlay
    function hideLoadingOverlay() {
        const overlay = document.getElementById('wonderlandLoadingOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
    
    // Fonction pour mettre à jour le message de chargement
    function updateLoadingMessage(title, subtitle) {
        const titleEl = document.getElementById('loadingTitle');
        const subtitleEl = document.getElementById('loadingSubtitle');
        
        if (titleEl) {
            titleEl.style.animation = 'none';
            setTimeout(() => {
                titleEl.textContent = title;
                titleEl.style.animation = 'glow 2s ease-in-out infinite';
            }, 50);
        }
        
        if (subtitleEl) {
            subtitleEl.textContent = subtitle;
        }
    }
    
    // Fonction utilitaire pour attendre
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Add input animation effects
    const inputs = registrationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}

// ===========================================
// Close Modal Function
// ===========================================
function closeModal() {
    if (successModal) {
        successModal.classList.remove('show');
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Close modal when clicking outside
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });
}

// ===========================================
// Confetti Animation
// ===========================================
function createConfetti() {
    const colors = ['#fbbf24', '#fca5a5', '#bfdbfe', '#a855f7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        const xMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            {
                transform: `translateY(0) rotate(0deg) translateX(0)`,
                opacity: 1
            },
            {
                transform: `translateY(100vh) rotate(${rotation}deg) translateX(${xMovement}px)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ===========================================
// Button Hover Effects
// ===========================================
const buttons = document.querySelectorAll('.cta-button, .cta-button-secondary, .submit-button');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===========================================
// Card Hover Effects with Tilt
// ===========================================
const cards = document.querySelectorAll('.feature-card, .value-card');

cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===========================================
// Parallax Effect for Hero Section
// ===========================================
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled * 0.002);
        }
    });
}

// ===========================================
// Typing Effect for Hero Tagline
// ===========================================
const tagline = document.querySelector('.hero-tagline');

if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing after initial animations
    setTimeout(typeWriter, 1500);
}

// ===========================================
// Easter Egg: Cheshire Cat Smile
// ===========================================
let clickCount = 0;
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
            const cat = document.createElement('div');
            cat.textContent = '😸';
            cat.style.position = 'fixed';
            cat.style.top = '50%';
            cat.style.left = '50%';
            cat.style.transform = 'translate(-50%, -50%)';
            cat.style.fontSize = '10rem';
            cat.style.zIndex = '9999';
            cat.style.opacity = '0';
            cat.style.transition = 'opacity 0.5s ease';
            
            document.body.appendChild(cat);
            
            setTimeout(() => {
                cat.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                cat.style.opacity = '0';
                setTimeout(() => cat.remove(), 500);
            }, 2000);
            
            clickCount = 0;
        }
    });
}

// ===========================================
// Loading Animation
// ===========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================================
// Random Color Change for Floating Elements
// ===========================================
setInterval(() => {
    const floatingCards = document.querySelectorAll('.floating-card');
    const colors = ['#fca5a5', '#fbbf24', '#bfdbfe', '#a855f7'];
    
    floatingCards.forEach(card => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        card.style.color = randomColor;
        card.style.transition = 'color 2s ease';
    });
}, 5000);

// ===========================================
// Scroll Progress Indicator
// ===========================================
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.id = 'scroll-progress';
    indicator.style.position = 'fixed';
    indicator.style.top = '0';
    indicator.style.left = '0';
    indicator.style.height = '4px';
    indicator.style.background = 'linear-gradient(90deg, #fbbf24, #fca5a5)';
    indicator.style.zIndex = '9999';
    indicator.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// ===========================================
// Conditional Fields for "Other" Options
// ===========================================
// Gender - Other field
const genderRadios = document.querySelectorAll('input[name="gender"]');
const genderOtherField = document.getElementById('genderOtherField');

if (genderRadios.length > 0 && genderOtherField) {
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                genderOtherField.style.display = 'block';
                genderOtherField.querySelector('input').required = true;
            } else {
                genderOtherField.style.display = 'none';
                genderOtherField.querySelector('input').required = false;
                genderOtherField.querySelector('input').value = '';
            }
        });
    });
}

// Medical Conditions - Other field
const medicalRadios = document.querySelectorAll('input[name="medicalConditions"]');
const medicalOtherField = document.getElementById('medicalConditionsOtherField');

if (medicalRadios.length > 0 && medicalOtherField) {
    medicalRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                medicalOtherField.style.display = 'block';
                medicalOtherField.querySelector('textarea').required = true;
            } else {
                medicalOtherField.style.display = 'none';
                medicalOtherField.querySelector('textarea').required = false;
                medicalOtherField.querySelector('textarea').value = '';
            }
        });
    });
}

// Communication Method - Other field
const commRadios = document.querySelectorAll('input[name="communicationMethod"]');
const commOtherField = document.getElementById('communicationMethodOtherField');

if (commRadios.length > 0 && commOtherField) {
    commRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                commOtherField.style.display = 'block';
                commOtherField.querySelector('input').required = true;
            } else {
                commOtherField.style.display = 'none';
                commOtherField.querySelector('input').required = false;
                commOtherField.querySelector('input').value = '';
            }
        });
    });
}

// ===========================================
// Console Easter Egg
// ===========================================
console.log('%c🎩 Welcome to Wonderland! 🎩', 'font-size: 24px; color: #fbbf24; font-weight: bold;');
console.log('%cCNN 2K25 - Where Ambition Meets Magic', 'font-size: 16px; color: #1e3a8a;');
console.log('%c"Curiouser and curiouser!" - Alice', 'font-style: italic; color: #a855f7;');

