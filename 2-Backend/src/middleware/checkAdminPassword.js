const { adminPassword } = require('../config/constants');

function checkAdminPassword(req, res, next) {
    const pw = req.header('x-admin-password') || req.body.adminPassword;
    if (!pw || pw !== adminPassword) {
        return res.status(401).json({ error: 'Unauthorized: invalid or missing admin password.' });
    }
    next();
}

module.exports = checkAdminPassword;
