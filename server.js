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
var counter = 1

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
  
  urlModel.findOne({orignal_link: req.surl}, async (err, data) => {
    if (data == null){
      data = await urlModel.create({orignal_link: req.surl, short_link: counter.toString()})
      console.log("creating", data)
    }
    counter++;
    console.log(counter)
    res.send(data)
  }) 
  
  })

app.get("/api/shorturl/:id", (req,res) => {
  let id = req.params.id
  
  urlModel.findOne({short_link: id}, (err, data) => {
    console.log(id,err,data)
    if (data == null) {
      res.send({"error":"No short URL found for the given input"})
    }
    else{
    res.send(data)
    }
  })
})



function urlAuth(req, res, next){
    console.log(req.body)
    let url = req.body.url;
    if (url.startsWith("http://") || url.startsWith("https://")){
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
        req.surl = regurlnb;
        next()
      }
  
    })
  }
  else{
    res.send({"error": "Invalid Url"})
  }

  }

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
