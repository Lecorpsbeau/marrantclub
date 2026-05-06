const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const MY_IP = process.env.ADMIN_IP;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (MY_IP && !userIp.includes(MY_IP)) {
        return res.status(403).json({ error: "IP non autorisée." });
    }

    const providedPass = (req.headers['x-password'] || '').trim();
    const actualPass = (ADMIN_PASSWORD || '').trim();

    if (!actualPass) {
        return res.status(500).json({ 
            error: "Password non configuré sur Vercel.",
            debug: "v4.0 - Serveur mis à jour"
        });
    }

    if (providedPass !== actualPass) {
        return res.status(401).json({ 
            error: "Mot de passe incorrect.",
            debug: `v4.0 - Recu: ${providedPass.length} car., Attendu: ${actualPass.length} car.` 
        });
    }

    try {
        const defis = await kv.lrange('defis_recus', 0, -1);
        return res.status(200).json({
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            debug: "v3.1 - OK",
            defis: defis
        });
    } catch (error) {
        return res.status(500).json({ error: "Erreur KV.", debug: error.message });
    }
};
