// ===========================================
// Wonderland Gallery - JavaScript
// Récupère et affiche les participants du Google Sheet
// ===========================================

// ⚠️ IMPORTANT : Remplacez cette URL par votre URL Apps Script pour récupérer les données
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzDfqRDBmb10cdxvFgKvnnuVQ1bcdGG3d-Rbzb--Smm0BMDP3SMHqdRBmF1NvYtRv8/exec';

// Configuration des personnages Wonderland
const WONDERLAND_CHARACTERS = {
    'Alice': {
        icon: '👧',
        trait: 'Curious & Brave',
        color: '#60a5fa'
    },
    'Mad Hatter': {
        icon: '🎩',
        trait: 'Creative & Eccentric',
        color: '#a78bfa'
    },
    'Cheshire Cat': {
        icon: '😸',
        trait: 'Mysterious & Wise',
        color: '#f472b6'
    },
    'White Rabbit': {
        icon: '🐰',
        trait: 'Organized & Punctual',
        color: '#fbbf24'
    },
    'Queen of Hearts': {
        icon: '👑',
        trait: 'Bold & Leader',
        color: '#ef4444'
    },
    'Caterpillar': {
        icon: '🐛',
        trait: 'Thoughtful & Philosophical',
        color: '#10b981'
    }
};

// Fonction principale pour charger les données
async function loadWonderlandData() {
    try {
        // Afficher l'état de chargement
        document.getElementById('loadingState').style.display = 'block';
        
        // Récupérer les données du Google Sheet
        const response = await fetch(GOOGLE_SHEET_API_URL);
        const data = await response.json();
        
        // Masquer l'état de chargement
        document.getElementById('loadingState').style.display = 'none';
        
        // Organiser les participants par personnage
        const participantsByCharacter = organizeByCharacter(data.participants || []);
        
        // Afficher les statistiques
        displayStats(data.participants || []);
        
        // Afficher les participants
        displayWonderlandRealms(participantsByCharacter);
        
        // Créer les particules magiques
        createMagicParticles();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        document.getElementById('loadingState').innerHTML = `
            <div style="text-align: center; color: #ef4444;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">Oops! The portal to Wonderland seems closed...</p>
                <p style="font-size: 1rem; color: #94a3b8;">Please try again later or contact the OC team.</p>
            </div>
        `;
    }
}

// Organiser les participants par personnage
function organizeByCharacter(participants) {
    const organized = {};
    
    participants.forEach(participant => {
        const character = participant.wonderlandCharacter || 'Other';
        if (!organized[character]) {
            organized[character] = [];
        }
        organized[character].push(participant);
    });
    
    return organized;
}

// Afficher les statistiques
function displayStats(participants) {
    const totalCount = participants.length;
    const charactersCount = new Set(participants.map(p => p.wonderlandCharacter)).size;
    
    // Animation des chiffres
    animateCounter('totalCount', totalCount);
    animateCounter('charactersCount', charactersCount);
}

// Animer un compteur
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    let current = 0;
    const duration = 2000; // 2 secondes
    const increment = target / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Afficher les royaumes Wonderland
function displayWonderlandRealms(participantsByCharacter) {
    const container = document.getElementById('wonderlandRealms');
    container.innerHTML = '';
    
    // Trier les personnages selon l'ordre défini
    const characterOrder = Object.keys(WONDERLAND_CHARACTERS);
    
    characterOrder.forEach((character, index) => {
        if (participantsByCharacter[character] && participantsByCharacter[character].length > 0) {
            const realm = createRealmSection(
                character,
                participantsByCharacter[character],
                index
            );
            container.appendChild(realm);
        }
    });
    
    // Ajouter les "autres" s'il y en a
    if (participantsByCharacter['Other']) {
        const realm = createRealmSection(
            'Other',
            participantsByCharacter['Other'],
            characterOrder.length
        );
        container.appendChild(realm);
    }
}

// Créer une section de royaume
function createRealmSection(character, participants, index) {
    const section = document.createElement('div');
    section.className = 'character-realm';
    section.style.animationDelay = `${index * 0.2}s`;
    
    const characterInfo = WONDERLAND_CHARACTERS[character] || {
        icon: '✨',
        trait: 'Unique & Special',
        color: '#fbbf24'
    };
    
    section.innerHTML = `
        <div class="realm-header">
            <div class="realm-icon">${characterInfo.icon}</div>
            <h2 class="realm-name">${character}'s Realm</h2>
            <p class="realm-trait">${characterInfo.trait}</p>
        </div>
        <div class="wonderland-grid" id="grid-${character.replace(/\s+/g, '-')}">
        </div>
    `;
    
    // Ajouter les cartes des participants
    const grid = section.querySelector('.wonderland-grid');
    participants.forEach((participant, pIndex) => {
        const card = createParticipantCard(participant, characterInfo, pIndex);
        grid.appendChild(card);
    });
    
    return section;
}

// Créer une carte de participant
function createParticipantCard(participant, characterInfo, index) {
    const card = document.createElement('div');
    card.className = 'wonderland-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // URL de la photo (ou image par défaut)
    const photoUrl = participant.photoUrl && participant.photoUrl !== 'Pas de photo' 
        ? participant.photoUrl 
        : 'https://via.placeholder.com/300x300/1e293b/fbbf24?text=' + encodeURIComponent(participant.fullName || 'No Name');
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${photoUrl}" alt="${participant.fullName}" class="card-image" 
                 onerror="this.src='https://via.placeholder.com/300x300/1e293b/fbbf24?text=${encodeURIComponent(participant.fullName || 'No Name')}'">
            <div class="card-overlay"></div>
            <div class="card-character-icon">${characterInfo.icon}</div>
        </div>
        <div class="card-content">
            <h3 class="card-name">${participant.fullName || 'Unknown'}</h3>
            <p class="card-position">${participant.aiesecPosition || 'Member'}</p>
            <p class="card-quote">"${getRandomWonderlandQuote()}"</p>
        </div>
    `;
    
    // Ajouter un effet au clic
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
    
    return card;
}

// Citations aléatoires de Wonderland
function getRandomWonderlandQuote() {
    const quotes = [
        "Curiouser and curiouser!",
        "We're all mad here",
        "Why, sometimes I've believed as many as six impossible things before breakfast",
        "If you don't know where you are going, any road will get you there",
        "It's no use going back to yesterday, because I was a different person then",
        "Imagination is the only weapon in the war against reality",
        "Who in the world am I? Ah, that's the great puzzle",
        "Every adventure requires a first step"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Créer des particules magiques dans le fond
function createMagicParticles() {
    const bg = document.getElementById('wonderlandBg');
    const icons = ['✨', '💫', '⭐', '🌟', '💎', '🔮', '🎭', '🎩', '🐰', '🫖', '🌹', '🃏'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-icon';
        particle.textContent = icons[Math.floor(Math.random() * icons.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        bg.appendChild(particle);
    }
}

// Back to top button
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Charger les données au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    loadWonderlandData();
});

// Effet de particules magiques au mouvement de la souris
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) { // 5% de chance
        createMagicSparkle(e.clientX, e.clientY);
    }
});

function createMagicSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-particle';
    sparkle.textContent = '✨';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = (Math.random() * 20 + 10) + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 4000);
}


