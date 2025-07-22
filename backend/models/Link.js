// This Code is Written By  -- ASIM HUSAIN

const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
});

module.exports = mongoose.model('Link', linkSchema);