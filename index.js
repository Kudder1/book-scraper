const browserObject = require('./browser');
const scraperController = require('./pageController');
let browserInstance = browserObject.startBrowser();

async function scrape(url) {
    await scraperController(browserInstance, url);
}

scrape('http://loveread.ec/read_book.php?id=96004&p=1')