require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

const mongoose = require('mongoose');
const { url } = require('inspector');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;


const urlSchema = new Schema({
 
  orignal_link: {type: String, required: true},
  short_link: String

})

let urlModel = mongoose.model("urlModel", urlSchema);

// Basic Configuration
// const port = process.env.PORT || 3000;
const port = 3000;

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', urlAuth, (req, res) => {
    res.send({"ok":"lmao"})
  })



function urlAuth(req, res, next){
    console.log(req.body)
    let url = req.body.url;
    const REPLACE_REGEX = /^https?:\/\//i
    const TRAIL_SLASH = /\/$/
    const regurl = url.replace(REPLACE_REGEX, '');
    const regurlnb = regurl.replace(TRAIL_SLASH, '');
    console.log(regurlnb)
    dns.lookup(regurlnb, 'ANY', (err, address, family)=>{
      if (err) {
        console.log(err,address,family)
        res.send({"error": "Invalid Url"})
      }
      else{
        next()
      }
  
    })

  }

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
