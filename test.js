module.exports = async function handler(req, res) {
    return res.status(200).json({ 
        message: "COUCOU ! Le serveur est bien à jour !",
        time: new Date().toLocaleTimeString('fr-FR')
    });
};
