const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
module.exports = mongoose.connect(uri, { useNewUrlParser: true});