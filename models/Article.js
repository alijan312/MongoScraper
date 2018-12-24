const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: false
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create article model
const Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;