const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk/',
  },
];

const articles = [];

newspapers.forEach(newspaper => {
  axios
    .get(newspaper.address)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch(err => console.log(err));
});

app.get('/', (req, res) => {
  res.json('Welcome to the Climate Change API');
});

app.get('/news', (req, res) => {
  res.json(articles);
});

app.get('news/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAdress = newspapers.filter(
    newspaper => newspaper.name == newspaperId[0].address
  );
  console.log(newspaperAdress);
  // axios.get();
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
