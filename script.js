// Game state
let gameState = {
    currentLocation: "study",
    inventory: [],
    evidence: {},
    visitedLocations: new Set(["study"]),
    accused: false
};

// Game data
const locations = {
    "study": {
        name: "Study",
        description: "You stand in the opulent study. The scent of cigar smoke and expensive whiskey lingers. William's body has been removed, but blood stains the Persian rug. Snow falls silently outside the shattered window.",
        image: "images/Sceans/study.png"
    },
    "office": {
        name: "Office",
        description: "William's private office. Neat stacks of financial reports contrast with family photos showing strained smiles. The blinking router light casts an eerie glow.",
        image: "images/Sceans/office.png"
    },
    "garden": {
        name: "Garden",
        description: "The snow-covered garden. Icicles hang like daggers from barren trees. Yellow police tape cordons off the area near the study window.",
        image: "images/Sceans/garden.png"
    },
    "dining": {
        name: "Dining Hall",
        description: "The dining hall where the New Year's party ended in tragedy. Half-empty champagne flutes and abandoned party favors litter the table.",
        image: "images/Sceans/dining.png"
    }
};

const suspects = [
    {
        name: "William Harper",
        relationship: "Victim",
        status: "Deceased",
        alibi: "N/A",
        description: "The victim. A respected and well-connected CFO found murdered on New Year's Eve.",
        image: "images/characters/william.png"
    },
    {
        name: "Eleanor Harper",
        relationship: "Wife",
        status: "Grieving",
        alibi: "Hosting guests",
        description: "William's wife of 15 years. Recently discovered William was having an affair.",
        image: "images/characters/Eleanor.png"
    },
    {
        name: "Richard Vance",
        relationship: "Business Partner",
        status: "Nervous",
        alibi: "On balcony",
        description: "William's business partner and long-time friend. Recently discovered embezzling company funds.",
        image: "images/characters/Richard.png"
    },
    {
        name: "Clara Bennett",
        relationship: "Assistant",
        status: "Agitated",
        alibi: "Preparing champagne",
        description: "William's personal assistant. Recently asked for a raise and was denied.",
        image: "images/characters/Clara.png"
    },
    {
        name: "Michael Reed",
        relationship: "Rival Executive",
        status: "Defensive",
        alibi: "In library",
        description: "William's business rival. Recently lost a major contract to William's company.",
        image: "images/characters/Michael.png"
    }
];

const clues = {
    "study": [
        {
            name: "Trophy",
            description: "Bloodstained award engraved 'Top CFO 2023'. The murder weapon?",
            image: "images/Evedences/Trophy.png",
            tag: "weapon",
            interaction: null
        },
        {
            name: "Torn Note",
            description: "Partially burned scrap: '...meet at 11:30... final warn...'",
            image: "images/Evedences/Note.png",
            tag: "document",
            interaction: "reconstruct"
        },
        {
            name: "Financial Report",
            description: "Documents showing $2M missing from company funds",
            image: "images/Evedences/report.png",
            tag: "document",
            interaction: null
        }
    ],
    "office": [
        {
            name: "Password-protected Laptop",
            description: "William's work computer. Requires a password to access.",
            image: "images/Evedences/Laptop.png",
            tag: "electronic",
            interaction: "password"
        },
        {
            name: "Appointment Book",
            description: "December 31 entry: 'RC - 11:30. Last chance.'",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect x='50' y='50' width='100' height='120' fill='%23c2185b' stroke='%23000' stroke-width='1'/%3E%3Crect x='60' y='60' width='80' height='100' fill='white'/%3E%3Cpath d='M70,80 L130,80 M70,100 L130,100 M70,120 L130,120' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E",
            tag: "document",
            interaction: null
        }
    ],
    "garden": [
        {
            name: "Broken Watch",
            description: "Frozen timepiece stopped at 11:35 PM. Time of death?",
            image: "images/Evedences/Watch.png",
            tag: "physical",
            interaction: null
        },
        {
            name: "Footprints",
            description: "Size 10 men's boots leading to study window",
            image: "images/Evedences/Footprints.png",
            tag: "physical",
            interaction: null
        }
    ],
    "dining": [
        {
            name: "Champagne Glass",
            description: "Smudged lipstick (shade: Crimson Night)",
            image: "images/Evedences/Glass.png",
            tag: "physical",
            interaction: null
        },
        {
            name: "Security Feed",
            description: "Timestamp 11:28-11:32 shows Richard leaving balcony",
            image: "images/Evedences/Feed.png",
            tag: "electronic",
            interaction: "view"
        }
    ]
};

// DOM Elements
const locationNameEl = document.getElementById('location-name');
const locationImgEl = document.getElementById('location-img');
const locationDescEl = document.getElementById('location-description');
const cluesContainerEl = document.getElementById('clues-container');
const suspectsContainerEl = document.getElementById('suspects-container');
const inventoryContainerEl = document.getElementById('inventory-container');
const accuseBtn = document.getElementById('accuse-btn');

// Modals
const clueModal = document.getElementById('clue-modal');
const clueModalTitle = document.getElementById('clue-modal-title');
const clueModalImg = document.getElementById('clue-modal-img');
const clueModalDesc = document.getElementById('clue-modal-description');
const clueInteraction = document.getElementById('clue-interaction');

const suspectModal = document.getElementById('suspect-modal');
const suspectModalTitle = document.getElementById('suspect-modal-title');
const suspectModalImg = document.getElementById('suspect-modal-img');
const suspectRelationship = document.getElementById('suspect-relationship');
const suspectAlibi = document.getElementById('suspect-alibi');
const suspectStatus = document.getElementById('suspect-status');

const accuseModal = document.getElementById('accuse-modal');
const resultModal = document.getElementById('result-modal');
const resultTitle = document.getElementById('result-title');
const resultContent = document.getElementById('result-content');

// Initialize game
function initGame() {
    updateLocation();
    renderSuspects();
    updateInventory();
    
    // Add event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.currentLocation = btn.dataset.location;
            updateLocation();
        });
    });
    
    accuseBtn.addEventListener('click', () => {
        showAccuseModal();
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            clueModal.style.display = 'none';
            suspectModal.style.display = 'none';
            accuseModal.style.display = 'none';
            resultModal.style.display = 'none';
        });
    });
    
    document.getElementById('submit-accusation').addEventListener('click', checkAccusation);
    document.getElementById('play-again').addEventListener('click', resetGame);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === clueModal) clueModal.style.display = 'none';
        if (e.target === suspectModal) suspectModal.style.display = 'none';
        if (e.target === accuseModal) accuseModal.style.display = 'none';
        if (e.target === resultModal) resultModal.style.display = 'none';
    });
}

// Update current location view
function updateLocation() {
    const location = locations[gameState.currentLocation];
    locationNameEl.textContent = location.name;
    locationImgEl.src = location.image;
    locationDescEl.textContent = location.description;
    
    renderClues();
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.location === gameState.currentLocation);
    });
    
    gameState.visitedLocations.add(gameState.currentLocation);
}

// Render clues for current location
function renderClues() {
    cluesContainerEl.innerHTML = '';
    
    const locationClues = clues[gameState.currentLocation];
    
    locationClues.forEach(clue => {
        const clueCard = document.createElement('div');
        clueCard.className = 'clue-card';
        clueCard.innerHTML = `
            <div class="clue-image">
                <img src="${clue.image}" alt="${clue.name}">
            </div>
            <div class="clue-name">${clue.name}</div>
        `;
        
        clueCard.addEventListener('click', () => {
            showClueModal(clue);
        });
        
        cluesContainerEl.appendChild(clueCard);
    });
}

// Render suspects
function renderSuspects() {
    suspectsContainerEl.innerHTML = '';
    
    suspects.forEach(suspect => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.innerHTML = `
            <div class="character-image">
                <img src="${suspect.image}" alt="${suspect.name}">
            </div>
            <div class="character-info">
                <div class="character-name">${suspect.name}</div>
                <div class="character-relationship">${suspect.relationship}</div>
            </div>
        `;
        
        characterCard.addEventListener('click', () => {
            showSuspectModal(suspect);
        });
        
        suspectsContainerEl.appendChild(characterCard);
    });
}

// Update inventory display
function updateInventory() {
    if (gameState.inventory.length === 0) {
        inventoryContainerEl.innerHTML = '<p>No evidence collected yet</p>';
        return;
    }
    
    inventoryContainerEl.innerHTML = '';
    gameState.inventory.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.innerHTML = `
            <i class="fas fa-clipboard-list"></i>
            <span>${item}</span>
        `;
        inventoryContainerEl.appendChild(itemEl);
    });
}

// Show clue modal
function showClueModal(clue) {
    clueModalTitle.textContent = clue.name;
    clueModalImg.src = clue.image;
    clueModalDesc.textContent = clue.description;
    clueInteraction.innerHTML = '';
    
    // Add interactions
    if (clue.interaction === 'password') {
        clueInteraction.innerHTML = `
            <div class="interaction">
                <p>Enter password to unlock the laptop (try important dates):</p>
                <input type="text" id="password-input" placeholder="MMDD format">
                <button id="submit-password">Unlock</button>
            </div>
        `;
        
        document.getElementById('submit-password').addEventListener('click', () => {
            const password = document.getElementById('password-input').value;
            if (password === '1231') { // New Year's Eve
                clueInteraction.innerHTML = `
                    <div class="interaction-result">
                        <p>💻 LOGIN SUCCESSFUL! Email to Board of Directors:</p>
                        <p><em>"I've discovered Richard has embezzled $2M. Confrontation tonight. If anything happens to me..."</em></p>
                        <p class="evidence-added">+ Added to evidence: Laptop evidence</p>
                    </div>
                `;
                
                if (!gameState.inventory.includes("Laptop evidence")) {
                    gameState.inventory.push("Laptop evidence");
                    gameState.evidence['motive'] = "Richard embezzled $2M, William discovered";
                    updateInventory();
                }
            } else {
                clueInteraction.innerHTML = '<p class="error">Incorrect password! Hint: New Year\'s Eve date (MMDD)</p>';
            }
        });
    } else if (clue.interaction === 'reconstruct') {
        clueInteraction.innerHTML = `
            <div class="interaction">
                <button id="reconstruct-note">Reconstruct Note</button>
            </div>
        `;
        
        document.getElementById('reconstruct-note').addEventListener('click', () => {
            clueInteraction.innerHTML = `
                <div class="interaction-result">
                    <p>📜 RECONSTRUCTED MESSAGE:</p>
                    <p><em>"Richard - Meet at 11:30 in study. Final warning to return funds."</em></p>
                    <p class="evidence-added">+ Added to evidence: Reconstructed note</p>
                </div>
            `;
            
            if (!gameState.inventory.includes("Reconstructed note")) {
                gameState.inventory.push("Reconstructed note");
                gameState.evidence['appointment'] = "William summoned Richard before murder";
                updateInventory();
            }
        });
    } else if (clue.interaction === 'view') {
        clueInteraction.innerHTML = `
            <div class="interaction">
                <button id="view-footage">View Security Footage</button>
            </div>
        `;
        
        document.getElementById('view-footage').addEventListener('click', () => {
            clueInteraction.innerHTML = `
                <div class="interaction-result">
                    <p>🎥 SECURITY FOOTAGE:</p>
                    <p>11:28 PM - Richard leaves balcony</p>
                    <p>11:31 PM - Shadow passes study window</p>
                    <p>11:33 PM - Clara drops champagne tray</p>
                    <p class="evidence-added">+ Added to evidence: Security footage notes</p>
                </div>
            `;
            
            if (!gameState.inventory.includes("Security footage notes")) {
                gameState.inventory.push("Security footage notes");
                gameState.evidence['timeline'] = "Richard unaccounted for during murder window";
                updateInventory();
            }
        });
    }
    
    clueModal.style.display = 'block';
}

// Show suspect modal
function showSuspectModal(suspect) {
    suspectModalTitle.textContent = suspect.name;
    suspectModalImg.src = suspect.image;
    suspectRelationship.textContent = suspect.relationship;
    suspectAlibi.textContent = suspect.alibi;
    suspectStatus.textContent = suspect.status;
    
    suspectModal.style.display = 'block';
}

// Show accusation modal
function showAccuseModal() {
    accuseModal.style.display = 'block';
}

// Check accusation
function checkAccusation() {
    const suspect = document.getElementById('suspect-select').value;
    const motive = document.getElementById('motive').value;
    const weapon = document.getElementById('weapon').value;
    
    if (!suspect || !motive || !weapon) {
        alert("Please fill in all fields!");
        return;
    }
    
    accuseModal.style.display = 'none';
    resultModal.style.display = 'block';
    
    if (suspect === "Richard Vance" && 
        motive.toLowerCase().includes("embezzle") && 
        weapon.toLowerCase().includes("trophy")) {
        
        resultTitle.textContent = "✅ Case Solved!";
        resultContent.innerHTML = `
            <p>Richard Vance has been convicted!</p>
            <p>You present the evidence:</p>
            <ul>
                <li>Richard's financial fraud</li>
                <li>The 11:30 meeting</li>
                <li>Security footage placing him near the study</li>
                <li>The trophy weapon</li>
            </ul>
            <p>He confesses: <em>"He was going to ruin me! I just meant to scare him..."</em></p>
            <p class="victory">🌟 YOU'VE UNRAVELED THE MYSTERY! 🌟</p>
        `;
    } else {
        resultTitle.textContent = "❌ Incorrect Accusation!";
        resultContent.innerHTML = `
            <p>The real killer escapes justice.</p>
            <p>Key evidence you may have missed:</p>
            <ul>
                <li>Richard's financial fraud (laptop password: 1231)</li>
                <li>The reconstructed note in the study</li>
                <li>Security footage showing Richard's movements</li>
            </ul>
            <p class="hint">Better review your evidence and try again!</p>
        `;
    }
}

// Reset game
function resetGame() {
    gameState = {
        currentLocation: "study",
        inventory: [],
        evidence: {},
        visitedLocations: new Set(["study"]),
        accused: false
    };
    
    document.getElementById('suspect-select').selectedIndex = 0;
    document.getElementById('motive').value = '';
    document.getElementById('weapon').value = '';
    
    resultModal.style.display = 'none';
    updateLocation();
    updateInventory();
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);