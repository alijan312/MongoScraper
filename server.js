// Require dependencies
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const exphbs = require("express-handlebars");

// Require models
const db = require('./models');

// Initialize express
const app = express();

const PORT = 3000;

// Configure middleware
app.use(logger('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static('public'));

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/webscraper', {
    useNewUrlParser: true
});

app.get('/', function (req, res) {
    axios.get('https://www.nytimes.com/').then(function (response) {
        const $ = cheerio.load(response.data);
        $('article').each(function(i, element) {
            const result = {};
            result.title = $(this).find('h2').text();
            result.link = $(element).find('a').attr('href');
            result.summary = $(this).find('p').text();

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(error) {
                console.log(error);
            });
        });
    });
    db.Article.find({}).then(function(data) {
        res.render('index', {article: data});
    }).catch(function(error){
        res.json(error);
    });
    
});

// app.get('/scrape', function(req, res){
//     db.Article.find({}).then(function(data) {
//         res.render('index', {article: data});
//     }).catch(function(error){
//         res.json(error);
//     });
// });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})