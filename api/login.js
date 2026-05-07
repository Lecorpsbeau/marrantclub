
module.exports = async function handler(req, res) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || process.env.PASSWORD;
    const providedPass = (req.headers['x-password'] || '').trim();
    let actualPass = (ADMIN_PASSWORD || '').trim();
    actualPass = actualPass.replace(/^["']|["']$/g, '');

    if (!actualPass) {
        return res.status(500).json({ error: "Configuration manquante." });
    }

    if (providedPass === actualPass) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ error: "Mot de passe incorrect." });
    }
};
