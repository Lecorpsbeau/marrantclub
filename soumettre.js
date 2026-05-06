const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { departement, pseudo, message } = req.body;

        if (!departement || !pseudo || !message) {
            return res.status(400).json({ error: 'Champs manquants' });
        }

        const nouveauDefi = {
            departement,
            pseudo,
            message,
            date: new Date().toISOString()
        };

        // Sauvegarde dans la liste 'defis_recus'
        await kv.lpush('defis_recus', nouveauDefi);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Erreur soumission:", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};
