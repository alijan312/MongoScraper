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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static('public'));

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/webscraper', { useNewUrlParser: true });

app.get('/', function(req, res) {
    axios.get('https://www.nytimes.com/').then(function(response) {
        const $ = cheerio.load(response.data);
        $('article.story').each(function(i, element) {
            let result = {};

            result.title = $(element).children('h2').text();
            result.link = $(element).children('h2').children('a').attr('href');
            result.summary = $(element).children('p.summary').text();

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(error) {
                console.log(error);
            });
        });
        res.json(response);
    });
});

// Start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!");
})