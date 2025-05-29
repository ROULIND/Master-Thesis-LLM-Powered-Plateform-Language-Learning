const { translateText } = require('../services/translationService');

const translate = async (req, res) => {
    try {
        const { word } = req.query;
        if (!word) {
            return res.status(400).json({ error: "Query parameter 'word' is required" });
        }

        const result = await translateText(word);
        res.json(result);
    } catch (error) {
        console.error('Error in translation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    translate
};
