module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    try {
        const { departement, pseudo, message } = req.body;
        if (!departement || !pseudo || !message) {
            return res.status(400).json({ error: 'Champs manquants' });
        }

        const nouveauDefi = JSON.stringify({ departement, pseudo, message, date: new Date().toISOString() });

        if (KV_URL && KV_TOKEN) {
            await fetch(`${KV_URL}/lpush/defis_recus/${encodeURIComponent(nouveauDefi)}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Erreur serveur", debug: error.message });
    }
};