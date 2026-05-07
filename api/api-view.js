module.exports = async function handler(req, res) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "marrant";

    const providedPass = (req.headers['x-password'] || '').trim();
    let actualPass = (ADMIN_PASSWORD || '');
    actualPass = actualPass.replace(/^["']|["']$/g, '').trim();

    if (!actualPass) {
        return res.status(500).json({
            error: "ADMIN_PASSWORD non configuré sur Vercel.",
            debug: "v6.0 - Var manquante"
        });
    }

    if (providedPass !== actualPass) {
        return res.status(401).json({
            error: "Mot de passe incorrect.",
            debug: `v6.0 - Recu: ${providedPass.length} car., Attendu: ${actualPass.length} car.`
        });
    }

    // Connexion à Upstash
    const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        return res.status(200).json({
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            debug: "v6.0 - KV non connecté",
            defis: []
        });
    }

    try {
        const response = await fetch(`${KV_URL}/lrange/defis_recus/0/-1`, {
            headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        const data = await response.json();
        const defis = (data.result || []).map(item =>
            typeof item === 'string' ? JSON.parse(item) : item
        );

        return res.status(200).json({
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            debug: "v6.0 - OK",
            defis
        });
    } catch (error) {
        return res.status(500).json({
            error: "Erreur lecture KV.",
            debug: `v6.0 - ${error.message}`
        });
    }
};