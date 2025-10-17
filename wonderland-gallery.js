// ===========================================
// Wonderland Gallery - JavaScript
// Récupère et affiche les participants du Google Sheet
// ===========================================

// Force mobile visibility function
function forceMobileVisibility() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('📱 Mobile detected - forcing gallery visibility');
        
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
        
        // Force navigation visibility
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'block';
            navbar.style.visibility = 'visible';
        }
        
        console.log('✅ Gallery mobile visibility forced');
    }
}


// Initialize mobile visibility on load and resize
document.addEventListener('DOMContentLoaded', function() {
    forceMobileVisibility();
});

window.addEventListener('resize', function() {
    forceMobileVisibility();
});

// ⚠️ IMPORTANT : URL Apps Script mise à jour
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbx2EOI6LM1r5oJYFdqRvHd-Sf4YgIHULfE0uc_45OOD4IPIRFgZ9k10HWDhvwXSi-bP/exec';

// Configuration des personnages Wonderland (Participants normaux)
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

// Configuration des personnages Alumni (Premium)
const ALUMNI_CHARACTERS = {
    'Royal Alice': {
        icon: '👸',
        trait: 'Legendary & Inspiring',
        color: '#fbbf24',
        isAlumni: true
    },
    'Grand Master Hatter': {
        icon: '🎩',
        trait: 'Visionary & Mentor',
        color: '#f59e0b',
        isAlumni: true
    },
    'Ancient Cheshire Cat': {
        icon: '😸',
        trait: 'Wise & Enigmatic',
        color: '#d97706',
        isAlumni: true
    },
    'Time Master Rabbit': {
        icon: '🐰',
        trait: 'Timeless & Strategic',
        color: '#92400e',
        isAlumni: true
    },
    'Eternal Queen': {
        icon: '👑',
        trait: 'Eternal & Powerful',
        color: '#fbbf24',
        isAlumni: true
    },
    'Wisdom Keeper Caterpillar': {
        icon: '🐛',
        trait: 'Philosophical & Deep',
        color: '#f59e0b',
        isAlumni: true
    }
};

// Fonction pour créer une URL d'image de fallback fiable
function createFallbackImageUrl(text, width = 300, height = 300) {
    // Utiliser plusieurs services de fallback
    const services = [
        `https://placehold.co/${width}x${height}/1e293b/fbbf24?text=${encodeURIComponent(text)}`,
        `https://via.placeholder.com/${width}x${height}/1e293b/fbbf24?text=${encodeURIComponent(text)}`,
        `https://picsum.photos/${width}/${height}` // Service de fallback alternatif
    ];
    return services[0]; // Utiliser placehold.co en priorité
}

// Fonction pour tester et corriger les URLs Google Drive
function fixGoogleDriveUrl(url) {
    if (!url || !url.includes('drive.google.com')) {
        return url;
    }
    
    // Extraire l'ID du fichier
    const fileIdMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (!fileIdMatch || !fileIdMatch[1]) {
        return url;
    }
    
    const fileId = fileIdMatch[1];
    
    // Retourner le format le plus fiable
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Fonction pour tester les URLs des photos
function testPhotoUrls(participants) {
    console.log('=== TEST DES URLs DE PHOTOS ===');
    
    participants.forEach((participant, index) => {
        const isAlumni = participant.isalumni === true || participant.isAlumni === true || 
                        participant.formtype === 'alumni' || participant.formType === 'alumni';
        
        if (isAlumni) {
            const alumniPhotoUrl = participant.alumniphotourl || participant.alumniPhotoUrl || participant.alumni_photo_url || '';
            const memoryPhotoUrl = participant.memoryphotourl || participant.memoryPhotoUrl || participant.memory_photo_url || '';
            
            console.log(`Alumni ${index + 1} (${participant.fullname || participant.fullName}):`);
            console.log('  - Alumni Photo URL:', alumniPhotoUrl);
            console.log('  - Memory Photo URL:', memoryPhotoUrl);
            console.log('  - Is valid Alumni URL:', alumniPhotoUrl && alumniPhotoUrl.startsWith('http'));
            console.log('  - Is valid Memory URL:', memoryPhotoUrl && memoryPhotoUrl.startsWith('http'));
            
            // Tester l'accessibilité des URLs
            if (alumniPhotoUrl && alumniPhotoUrl.startsWith('http')) {
                testImageUrl(alumniPhotoUrl, `Alumni Photo ${index + 1}`);
            }
            if (memoryPhotoUrl && memoryPhotoUrl.startsWith('http')) {
                testImageUrl(memoryPhotoUrl, `Memory Photo ${index + 1}`);
            }
        } else {
            const photoUrl = participant.photourl || participant.photoUrl || participant.photo_url || '';
            
            console.log(`Regular ${index + 1} (${participant.fullname || participant.fullName}):`);
            console.log('  - Photo URL:', photoUrl);
            console.log('  - Is valid URL:', photoUrl && photoUrl.startsWith('http'));
            
            // Tester l'accessibilité de l'URL
            if (photoUrl && photoUrl.startsWith('http')) {
                testImageUrl(photoUrl, `Regular Photo ${index + 1}`);
            }
        }
    });
}

// Fonction pour tester l'accessibilité d'une URL d'image
function testImageUrl(url, label) {
    const img = new Image();
    img.onload = function() {
        console.log(`✅ ${label} accessible:`, url);
    };
    img.onerror = function() {
        console.log(`❌ ${label} non accessible:`, url);
    };
    img.src = url;
}

// Fonction pour convertir les URLs Google Drive au format direct
function convertGoogleDriveUrl(url) {
    if (!url || !url.includes('drive.google.com')) {
        return url;
    }
    
    // Extraire l'ID du fichier de l'URL Google Drive
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Convertir au format direct pour l'affichage d'images
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
}

// Fonction principale pour charger les données
async function loadWonderlandData() {
    try {
        // Afficher l'état de chargement
        document.getElementById('loadingState').style.display = 'block';
        
        // Récupérer les données du Google Sheet
        const response = await fetch(GOOGLE_SHEET_API_URL);
        const data = await response.json();
        
        console.log('=== DONNÉES REÇUES ===');
        console.log('Total participants:', data.participants?.length || 0);
        console.log('Données complètes:', data);
        
        // Debug: afficher quelques exemples de participants
        if (data.participants && data.participants.length > 0) {
            console.log('=== EXEMPLE PARTICIPANTS ===');
            data.participants.slice(0, 3).forEach((p, i) => {
                console.log(`Participant ${i + 1}:`, {
                    isAlumni: p.isAlumni,
                    formType: p.formType,
                    character: p.wonderlandcharacter || p.alumniCharacter,
                    photoUrl: p.photourl || p.alumniPhotoUrl,
                    fullName: p.fullname || p.fullName,
                    allKeys: Object.keys(p)
                });
                console.log('Détails des URLs pour ce participant:', {
                    photourl: p.photourl,
                    photoUrl: p.photoUrl,
                    photo_url: p.photo_url,
                    alumniphotourl: p.alumniphotourl,
                    alumniPhotoUrl: p.alumniPhotoUrl,
                    alumni_photo_url: p.alumni_photo_url,
                    memoryphotourl: p.memoryphotourl,
                    memoryPhotoUrl: p.memoryPhotoUrl,
                    memory_photo_url: p.memory_photo_url
                });
            });
        }
        
        // Masquer l'état de chargement
        document.getElementById('loadingState').style.display = 'none';
        
        // Organiser les participants par personnage
        const participantsByCharacter = organizeByCharacter(data.participants || []);
        
        console.log('=== PARTICIPANTS ORGANISÉS ===');
        console.log('Alumni par personnage:', participantsByCharacter.alumni);
        console.log('Réguliers par personnage:', participantsByCharacter.regular);
        
        // Tester les URLs des photos
        testPhotoUrls(data.participants || []);
        
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
    const organized = {
        alumni: {},
        regular: {}
    };
    
    console.log('Organizing participants:', participants);
    
    participants.forEach(participant => {
        console.log('Processing participant:', participant);
        
        // Normaliser les propriétés (gérer les différentes variantes)
        const isAlumni = participant.isalumni === true || 
                        participant.isAlumni === true || 
                        participant.formtype === 'alumni' || 
                        participant.formType === 'alumni';
        
        const character = participant.wonderlandcharacter || 
                         participant.wonderlandCharacter || 
                         participant.alumnicharacter || 
                         participant.alumniCharacter || 
                         'Other';
        
        console.log('Is Alumni:', isAlumni, 'Character:', character);
        
        // Vérifier si c'est un alumni
        if (isAlumni) {
            console.log('Adding to alumni with character:', character);
            if (!organized.alumni[character]) {
                organized.alumni[character] = [];
            }
            organized.alumni[character].push(participant);
        } else {
            // Participant régulier
            console.log('Adding to regular character:', character, participant);
            if (!organized.regular[character]) {
                organized.regular[character] = [];
            }
            organized.regular[character].push(participant);
        }
    });
    
    console.log('Final organized data:', organized);
    return organized;
}

// Afficher les statistiques
function displayStats(participants) {
    console.log('Displaying stats for participants:', participants);
    
    const totalCount = participants.length;
    
    // Normaliser les propriétés pour le comptage
    const alumniCount = participants.filter(p => {
        return p.isalumni === true || 
               p.isAlumni === true || 
               p.formtype === 'alumni' || 
               p.formType === 'alumni';
    }).length;
    
    const regularCount = totalCount - alumniCount;
    
    const charactersCount = new Set(participants.map(p => {
        return p.wonderlandcharacter || 
               p.wonderlandCharacter || 
               p.alumnicharacter || 
               p.alumniCharacter;
    }).filter(Boolean)).size;
    
    console.log('Stats:', { totalCount, alumniCount, regularCount, charactersCount });
    
    // Animation des chiffres
    animateCounter('totalCount', totalCount);
    animateCounter('charactersCount', charactersCount);
    
    // Mettre à jour les statistiques alumni si les éléments existent
    const alumniCountEl = document.getElementById('alumniCount');
    const regularCountEl = document.getElementById('regularCount');
    
    if (alumniCountEl) animateCounter('alumniCount', alumniCount);
    if (regularCountEl) animateCounter('regularCount', regularCount);
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
    
    let index = 0;
    
    // D'abord afficher les Alumni organisés par personnage
    if (participantsByCharacter.alumni) {
        const alumniCharacters = Object.keys(participantsByCharacter.alumni);
        alumniCharacters.forEach(character => {
            const alumniForCharacter = participantsByCharacter.alumni[character];
            if (alumniForCharacter && alumniForCharacter.length > 0) {
                const alumniRealm = createAlumniRealmSection(alumniForCharacter, index, character);
                container.appendChild(alumniRealm);
                index++;
            }
        });
    }
    
    // Ensuite afficher les participants réguliers
    const characterOrder = Object.keys(WONDERLAND_CHARACTERS);
    
    characterOrder.forEach((character) => {
        if (participantsByCharacter.regular[character] && participantsByCharacter.regular[character].length > 0) {
            const realm = createRealmSection(
                character,
                participantsByCharacter.regular[character],
                index
            );
            container.appendChild(realm);
            index++;
        }
    });
    
    // Ajouter les "autres" s'il y en a
    if (participantsByCharacter.regular['Other']) {
        const realm = createRealmSection(
            'Other',
            participantsByCharacter.regular['Other'],
            index
        );
        container.appendChild(realm);
    }
}

// Créer une section spéciale pour les Alumni
function createAlumniRealmSection(alumniParticipants, index, character) {
    const section = document.createElement('div');
    section.className = 'character-realm alumni-realm';
    section.style.animationDelay = `${index * 0.2}s`;
    
    // Obtenir les informations du personnage
    const characterInfo = ALUMNI_CHARACTERS[character] || {
        icon: '👸',
        trait: 'Legendary & Inspiring',
        color: '#fbbf24',
        isAlumni: true
    };
    
    section.innerHTML = `
        <div class="realm-header alumni-header">
            <div class="realm-icon alumni-crown">${characterInfo.icon}</div>
            <h2 class="realm-name alumni-title">${character}'s Alumni Realm</h2>
            <p class="realm-trait alumni-subtitle">${characterInfo.trait} - Legendary Alumni</p>
            <div class="alumni-badge">Premium Alumni</div>
        </div>
        <div class="wonderland-grid alumni-grid" id="grid-alumni-${character}">
        </div>
    `;
    
    // Ajouter les cartes des alumni
    const grid = section.querySelector('.wonderland-grid');
    alumniParticipants.forEach((alumni, pIndex) => {
        const card = createAlumniCard(alumni, characterInfo, pIndex);
        grid.appendChild(card);
    });
    
    return section;
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

// Créer une carte d'alumni (premium)
function createAlumniCard(alumni, characterInfo, index) {
    console.log('Creating alumni card for:', alumni);
    
    const card = document.createElement('div');
    card.className = 'wonderland-card alumni-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Normaliser les propriétés - vérifier toutes les variantes possibles
    const alumniPhotoUrl = alumni.alumniphotourl || alumni.alumniPhotoUrl || alumni.alumni_photo_url || '';
    const memoryPhotoUrl = alumni.memoryphotourl || alumni.memoryPhotoUrl || alumni.memory_photo_url || '';
    const fullName = alumni.fullname || alumni.fullName || alumni.full_name || 'Unknown Alumni';
    const mandate = alumni.aiesecmandate || alumni.aiesecMandate || alumni.aiesec_mandate || 'AIESEC Alumni';
    const memoryShare = alumni.memoryshare || alumni.memoryShare || alumni.memory_share || getRandomAlumniQuote();
    
    // Utiliser la photo alumni pour wonderland, sinon fallback sur memory photo, sinon placeholder
    let finalPhotoUrl = '';
    if (alumniPhotoUrl && alumniPhotoUrl !== 'Pas de photo alumni' && alumniPhotoUrl !== '' && alumniPhotoUrl !== 'undefined' && alumniPhotoUrl.startsWith('http')) {
        // Corriger l'URL Google Drive si nécessaire
        finalPhotoUrl = fixGoogleDriveUrl(alumniPhotoUrl);
    } else if (memoryPhotoUrl && memoryPhotoUrl !== 'Pas de photo de mémoire' && memoryPhotoUrl !== '' && memoryPhotoUrl !== 'undefined' && memoryPhotoUrl.startsWith('http')) {
        // Corriger l'URL Google Drive si nécessaire
        finalPhotoUrl = fixGoogleDriveUrl(memoryPhotoUrl);
    } else {
        finalPhotoUrl = createFallbackImageUrl(fullName);
    }
    
    console.log('Raw alumni data:', {
        alumniphotourl: alumni.alumniphotourl,
        alumniPhotoUrl: alumni.alumniPhotoUrl,
        alumni_photo_url: alumni.alumni_photo_url,
        memoryphotourl: alumni.memoryphotourl,
        memoryPhotoUrl: alumni.memoryPhotoUrl,
        memory_photo_url: alumni.memory_photo_url,
        fullname: alumni.fullname,
        fullName: alumni.fullName,
        full_name: alumni.full_name,
        allKeys: Object.keys(alumni)
    });
    
    console.log('Final alumni photo URL:', finalPhotoUrl);
    
    card.innerHTML = `
        <div class="card-image-container alumni-image-container">
            <img src="${finalPhotoUrl}" alt="${fullName}" class="card-image alumni-image" 
                 onload="console.log('✅ Alumni photo loaded successfully:', this.src)"
                 onerror="console.log('❌ Alumni photo failed to load:', this.src); this.src='${createFallbackImageUrl(fullName)}'">
            <div class="card-overlay alumni-overlay"></div>
            <div class="card-character-icon alumni-character-icon">${characterInfo.icon}</div>
            <div class="alumni-premium-badge">👑</div>
        </div>
        <div class="card-content alumni-content">
            <h3 class="card-name alumni-name">${fullName}</h3>
            <p class="card-position alumni-mandate">${mandate}</p>
            <div class="alumni-character-badge">${characterInfo.trait}</div>
        </div>
    `;
    
    // Ajouter un effet au clic spécial pour les alumni
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95) rotateY(5deg)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
    
    return card;
}

// Créer une carte de participant
function createParticipantCard(participant, characterInfo, index) {
    console.log('Creating card for participant:', participant);
    
    const card = document.createElement('div');
    card.className = 'wonderland-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Normaliser les propriétés - vérifier toutes les variantes possibles
    const photoUrl = participant.photourl || participant.photoUrl || participant.photo_url || '';
    const fullName = participant.fullname || participant.fullName || participant.full_name || 'Unknown';
    const position = participant.aiesecposition || participant.aiesecPosition || participant.aiesec_position || 'Member';
    
    console.log('Raw participant data:', {
        photourl: participant.photourl,
        photoUrl: participant.photoUrl,
        photo_url: participant.photo_url,
        fullname: participant.fullname,
        fullName: participant.fullName,
        full_name: participant.full_name,
        allKeys: Object.keys(participant)
    });
    
    // URL finale de la photo - vérifier si c'est une URL valide
    let finalPhotoUrl = '';
    if (photoUrl && photoUrl !== 'Pas de photo' && photoUrl !== '' && photoUrl !== 'undefined' && photoUrl.startsWith('http')) {
        // Corriger l'URL Google Drive si nécessaire
        finalPhotoUrl = fixGoogleDriveUrl(photoUrl);
    } else {
        finalPhotoUrl = createFallbackImageUrl(fullName);
    }
    
    console.log('Final photo URL for regular participant:', finalPhotoUrl);
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${finalPhotoUrl}" alt="${fullName}" class="card-image" 
                 onload="console.log('✅ Photo loaded successfully:', this.src)"
                 onerror="console.log('❌ Photo failed to load:', this.src); this.src='${createFallbackImageUrl(fullName)}'">
            <div class="card-overlay"></div>
            <div class="card-character-icon">${characterInfo.icon}</div>
        </div>
        <div class="card-content">
            <h3 class="card-name">${fullName}</h3>
            <p class="card-position">${position}</p>
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

// Citations spéciales pour les Alumni
function getRandomAlumniQuote() {
    const alumniQuotes = [
        "Once an AIESECer, always an AIESECer",
        "The legacy we leave behind shapes the future",
        "Leadership is not about being in charge, it's about taking care of those in your charge",
        "The best way to predict the future is to create it",
        "Success is not final, failure is not fatal: it is the courage to continue that counts",
        "The greatest glory in living lies not in never falling, but in rising every time we fall",
        "Be the change you wish to see in the world",
        "Leadership is influence, nothing more, nothing less"
    ];
    return alumniQuotes[Math.floor(Math.random() * alumniQuotes.length)];
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


