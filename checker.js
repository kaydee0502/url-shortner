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


async function checker () {
    //const url = 'https://polar-inlet-26552.herokuapp.com';
    //const url = 'https://url-shortener-microservice.freecodecamp.rocks';
    const url = 'http://localhost:3000';
    const urlVariable = Date.now();
    const fullUrl = `${url}/?v=${urlVariable}`
    const res = await fetch(url + '/api/shorturl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${fullUrl}`
    });
    
    if (res.ok) {
      const { short_url, original_url } = await res.json();
      console.log(short_url,original_url)
      assert.isNotNull(short_url);
      assert.strictEqual(original_url, `${url}/?v=${urlVariable}`);
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  };
async function checker2 () {
    //const url = 'https://polar-inlet-26552.herokuapp.com';
    //const url = 'https://url-shortener-microservice.freecodecamp.rocks';
    const url = 'http://localhost:3000';
    const urlVariable = Date.now();
    const fullUrl = `${url}/?v=${urlVariable}`
    let shortenedUrlVariable;
    const postResponse = await fetch(url + '/api/shorturl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `url=${fullUrl}`
    });
    if (postResponse.ok) {
        const { short_url } = await postResponse.json();
        shortenedUrlVariable = short_url;
    } else {
        throw new Error(`${postResponse.status} ${postResponse.statusText}`);
    }
    const getResponse = await fetch(
        url + '/api/shorturl/' + shortenedUrlVariable
    );
    if (getResponse) {
        const { redirected, url } = getResponse;
        assert.isTrue(redirected);
        assert.strictEqual(url,fullUrl);
        console.log("pappu paas ho gaya")
    } else {
        throw new Error(`${getResponse.status} ${getResponse.statusText}`);
    }
    };

  checker2()
