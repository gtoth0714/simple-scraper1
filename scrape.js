const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeBooks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://books.toscrape.com/');

  const books = await page.evaluate(() => {
    const bookElements = document.querySelectorAll('.product_pod');
    let results = [];
    bookElements.forEach(book => {
      const title = book.querySelector('h3 a').getAttribute('title');
      const price = book.querySelector('.price_color').innerText;
      const availability = book.querySelector('.availability').innerText.trim();
      
      // Az értékelést a class alapján állapítjuk meg (pl. "star-rating Three")
      const ratingClass = book.querySelector('.star-rating').classList;
      let rating = 'No rating';
      if (ratingClass.contains('One')) rating = '1 star';
      else if (ratingClass.contains('Two')) rating = '2 stars';
      else if (ratingClass.contains('Three')) rating = '3 stars';
      else if (ratingClass.contains('Four')) rating = '4 stars';
      else if (ratingClass.contains('Five')) rating = '5 stars';

      results.push({ title, price, availability, rating });
    });
    return results;
  });

  // Formázzuk a szöveget fájlba íráshoz
  let output = '';
  books.forEach((book, index) => {
    output += `Book #${index + 1}\n`;
    output += `Title: ${book.title}\n`;
    output += `Price: ${book.price}\n`;
    output += `Availability: ${book.availability}\n`;
    output += `Rating: ${book.rating}\n`;
    output += `---------------------------\n`;
  });

  // Írás fájlba
  fs.writeFileSync('books.txt', output, 'utf-8');
  console.log('Adatok kimentve books.txt fájlba.');

  await browser.close();
}

scrapeBooks();
