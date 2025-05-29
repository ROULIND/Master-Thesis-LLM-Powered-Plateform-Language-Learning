const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require('./routes/video');
const storageRoutes = require('./routes/storage');
const adminRoutes = require('./routes/admin');
const translationRoutes = require('./routes/translation');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/admin', adminRoutes);
app.use('/storage', storageRoutes);
app.use('/video', videoRoutes);
app.use('/translation', translationRoutes);



module.exports = app;
