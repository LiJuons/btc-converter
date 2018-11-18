const express = require('express');
const path = require('path');
const cors = require('cors');
const BODYPARSER = require('body-parser');
const fetch = require('node-fetch');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

const updateCurrencies = async (req, res) => {
  try {
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(resp => resp.json())
        .then(json => {
            res.status(200).json(json);
          }).catch(err => res.status(400).json(err));
  }
  catch(err) {
    res.status(400).json(err)
  }
} //Update function that fetches data from CoinDesk's API

// An api endpoint that returns a short list of items
app.get('/currencies', (req, res) => {
  updateCurrencies(req, res);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


app.listen(PORT, () => console.log('App is listening on port ' + PORT));
