require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const fetch = require("node-fetch");
var chai = require('chai');  
var assert = chai.assert;

const mongoose = require('mongoose');
const { url } = require('inspector');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;
var counter = 1

const urlSchema = new Schema({
 
  orignal_link: {type: String, required: true},
  short_link: String

})

let urlModel = mongoose.model("urlModel", urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', urlAuth, (req, res) => {
  
  urlModel.findOne({orignal_link: req.furl}, async (err, data) => {
    if (data == null){
      data = await urlModel.create({orignal_link: req.furl, short_link: counter.toString()})

    }
    counter++;

    res.send({original_url: data.orignal_link, short_url: parseInt(data.short_link)})
  }) 
  
  })

app.get("/api/shorturl/:id", (req,res) => {
  let id = req.params.id
  
  urlModel.findOne({short_link: id}, (err, data) => {
    if (data == null) {
      res.send({"error":"No short URL found for the given input"})
    }
    else{
    res.redirect(data.orignal_link)
    }
  })
})



function urlAuth(req, res, next){
    console.log(req.body)
    let url = req.body.url;
    if (url.startsWith("http://") || url.startsWith("https://")){
    req.furl = url
    next()
  }
  else{
    res.send({"error": "Invalid Url"})
  }

  }



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
