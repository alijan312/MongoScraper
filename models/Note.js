const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema =  new Schema ({
    title: String,
    body: String
});

// Create note model
const Note = mongoose.model('Note', NoteSchema);

// Export the model
module.exports = Note;