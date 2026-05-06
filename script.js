document.addEventListener('DOMContentLoaded', () => {
    const selectDept = document.getElementById('submit-dept');

    // Liste des noms de départements (extrait pour l'exemple)
    const n0msDepartements = {
        "01": "Ain", "02": "Aisne", "03": "Allier", "04": "Alpes-de-Haute-Provence", "05": "Hautes-Alpes",
        "06": "Alpes-Maritimes", "07": "Ardèche", "08": "Ardennes", "09": "Ariège", "10": "Aube",
        "11": "Aude", "12": "Aveyron", "13": "Bouches-du-Rhône", "14": "Calvados", "15": "Cantal",
        "16": "Charente", "17": "Charente-Maritime", "18": "Cher", "19": "Corrèze", "2A": "Corse-du-Sud",
        "2B": "Haute-Corse", "21": "Côte-d'Or", "22": "Côtes-d'Armor", "23": "Creuse", "24": "Dordogne",
        "25": "Doubs", "26": "Drôme", "27": "Eure", "28": "Eure-et-Loir", "29": "Finistère",
        "30": "Gard", "31": "Haute-Garonne", "32": "Gers", "33": "Gironde", "34": "Hérault",
        "35": "Ille-et-Vilaine", "36": "Indre", "37": "Indre-et-Loire", "38": "Isère", "39": "Jura",
        "40": "Landes", "41": "Loir-et-Cher", "42": "Loire", "43": "Haute-Loire", "44": "Loire-Atlantique",
        "45": "Loiret", "46": "Lot", "47": "Lot-et-Garonne", "48": "Lozère", "49": "Maine-et-Loire",
        "50": "Manche", "51": "Marne", "52": "Haute-Marne", "53": "Mayenne", "54": "Meurthe-et-Moselle",
        "55": "Meuse", "56": "Morbihan", "57": "Moselle", "58": "Nièvre", "59": "Nord",
        "60": "Oise", "61": "Orne", "62": "Pas-de-Calais", "63": "Puy-de-Dôme", "64": "Pyrénées-Atlantiques",
        "65": "Hautes-Pyrénées", "66": "Pyrénées-Orientales", "67": "Bas-Rhin", "68": "Haut-Rhin", "69": "Rhône",
        "70": "Haute-Saône", "71": "Saône-et-Loire", "72": "Sarthe", "73": "Savoie", "74": "Haute-Savoie",
        "75": "Paris", "76": "Seine-Maritime", "77": "Seine-et-Marne", "78": "Yvelines", "79": "Deux-Sèvres",
        "80": "Somme", "81": "Tarn", "82": "Tarn-et-Garonne", "83": "Var", "84": "Vaucluse",
        "85": "Vendée", "86": "Vienne", "87": "Haute-Vienne", "88": "Vosges", "89": "Yonne",
        "90": "Territoire de Belfort", "91": "Essonne", "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "94": "Val-de-Marne",
        "95": "Val-d'Oise"
    };

    // On boucle de 1 à 96
    for (let i = 1; i <= 96; i++) {
        const opt = document.createElement('option');
        const num = i.toString().padStart(2, '0'); // Transforme 1 en "01"

        opt.value = num;

        // Si le nom est dans notre liste, on l'affiche, sinon on met juste le numéro
        const nom = n0msDepartements[num] || "";
        opt.innerHTML = `${num} ${nom ? '- ' + nom : ''}`;

        selectDept.appendChild(opt);
    }

    // Populate Defis Grid
    const defisGrid = document.getElementById("defis-grid");
    if (defisGrid && typeof DEPARTMENTS !== "undefined") {
        const doneDepts = DEPARTMENTS.filter(d => d.state === "done");
        
        doneDepts.forEach(dept => {
            const card = document.createElement("div");
            card.className = "defi-card";
            
            // Extract embed ID if needed to build a youtube link
            let embedId = dept.youtubeId;
            if (embedId && embedId.includes('v=')) {
              embedId = embedId.split('v=')[1].split('&')[0];
            } else if (embedId && embedId.includes('youtu.be/')) {
              embedId = embedId.split('youtu.be/')[1].split('?')[0];
            }
            
            const ytLink = embedId ? `<a href="https://www.youtube.com/watch?v=${embedId}" target="_blank" class="btn btn--outline" style="margin-top: 10px;"><i class="fa-brands fa-youtube" style="margin-right: 8px;"></i> Voir la vidéo</a>` : '';

            card.innerHTML = `
                <div class="defi-card__header">
                    <span class="defi-card__dept">${dept.id} - ${dept.name}</span>
                    <span class="defi-card__status done">Validé</span>
                </div>
                <div class="defi-card__title">${dept.challengeTitle || "Défi mystère"}</div>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; flex-grow: 1;">${dept.challengeSummary || ""}</p>
                ${ytLink}
            `;
            defisGrid.appendChild(card);
        });

        // Add "En cours" dept
        const currentDept = DEPARTMENTS.find(d => d.state === "current");
        if (currentDept) {
            const card = document.createElement("div");
            card.className = "defi-card";
            card.innerHTML = `
                <div class="defi-card__header">
                    <span class="defi-card__dept">${currentDept.id} - ${currentDept.name}</span>
                    <span class="defi-card__status current">En cours</span>
                </div>
                <div class="defi-card__title">Défi à venir</div>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 15px; flex-grow: 1;">Le Marrant Club est actuellement dans ce département !</p>
                <a href="https://www.twitch.tv/marrantclub" target="_blank" class="btn btn--yellow" style="margin-top: 10px;"><i class="fa-brands fa-twitch" style="margin-right: 8px;"></i> Rejoindre le live</a>
            `;
            defisGrid.appendChild(card);
        }
        
        // Update Progress Bar
        const progressCount = document.getElementById("progress-count");
        const progressFill = document.getElementById("progress-fill");
        if (progressCount && progressFill) {
            const total = DEPARTMENTS.length;
            const done = DEPARTMENTS.filter(d => d.state === "done").length;
            const percent = (done / total) * 100;
            
            progressCount.innerText = `${done.toString().padStart(2, '0')} / ${total} Départements validés`;
            progressFill.style.width = `${percent}%`;
        }

    }

    // Event listener for promo copy
    const promoBtn = document.getElementById("promo-btn");
    if (promoBtn) {
        promoBtn.addEventListener("click", copyPromo);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/soumettre', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            document.getElementById('form-success').style.display = 'block';
            form.reset();
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
}

function copyPromo() {
    const code = "MARRANTCLUBMEMETBIEN";
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById("promo-btn");
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check" style="color: var(--color-primary-green);"></i> Copié !`;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie: ', err);
    });
}
window.copyPromo = copyPromo;
