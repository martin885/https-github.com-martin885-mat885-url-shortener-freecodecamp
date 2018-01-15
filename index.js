'use strict'
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// const moduleHeader = require('./moduleHeader');
const shortUrl = require('./models/shortUrl.js');


mongoose.connect(process.env.OPENMONGODB_URI,{useMongoClient:true});
var port = Number(process.env.PORT || 8080);

const app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/new/:longUrl', function (req, res, next) {
    var longUrl = req.params.longUrl;
    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (regex.test(longUrl)) {
        var short = Math.floor(Math.random() * 10000).toString();
        var data = new shortUrl({
            originalUrl: longUrl,
            shorterUrl: short
        });
        data.save(function (err) {
            if (err) {
                res.send('Sorry an error has occurred');
            }
            console.log('Guardado con éxito');

        });

            res.json({originalUrl:data.originalUrl,shorterUrl:'https://mat885-url-shortener-freecodecamp.glitch.me/'+data.shorterUrl});

    }
    else {

        res.json({ error: 'The URL is not valid' });
    }
});

app.get('/:urlToForward', function (req, res, next) {
    var urlToForward = req.params.urlToForward;

    console.log('OOOKKKK');
    shortUrl.findOne({ shorterUrl: urlToForward }, function (err, doc) {
        if (err) { res.send('Sorry an error has occurred'); }

        var regex = new RegExp("^(http|https)://", "i");
        var strCheck = doc.originalUrl;
        if (regex.test(strCheck)) {
            res.redirect(doc.originalUrl);
        }
        else {
            res.redirect('http://' + doc.originalUrl);
        }

    });
});

app.listen(port, function () {
    console.log('OK');
});