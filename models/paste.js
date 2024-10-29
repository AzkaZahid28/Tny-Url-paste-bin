const mongoose = require('mongoose')

const pasteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
});

pasteSchema.index({ shortId: 1 }, { unique: true });

module.exports =  mongoose.model('Paste', pasteSchema);