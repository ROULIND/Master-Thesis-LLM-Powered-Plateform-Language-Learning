const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: process.env.GOOGLE_KEYS_PATH });

module.exports = storage;
