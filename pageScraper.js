const fs = require('fs');

const scraperObject = {
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        const pageTitle = await page.title();
        const bookName = pageTitle.split('|')[0].trim();
        async function scrapeCurrentPage() {
            await page.waitForSelector('.main_border');
            let urls = await page.$$eval('.tb_read_book', links => {
                links = links.map(el => {
                    el.querySelector('.MsoNormal').removeChild(el.querySelector('.MsoNormal').firstElementChild)
                    el.querySelector('.MsoNormal').removeChild(el.querySelector('.MsoNormal').lastElementChild)
                    el.querySelector('.MsoNormal').removeChild(el.querySelector('.MsoNormal').firstElementChild)
                    return el.querySelector('.MsoNormal').textContent.trim()
                })
                return Object.values(links).join();
            });
            fs.appendFile(`${bookName}.txt`, urls, 'utf8', function (err) {
                if (err) return console.log(err);
                console.log(`${bookName}.txt updated`);
            });

            let nextButtonExist = false;
            try {
                await page.$eval('.navigation > a:last-child', a => a.textContent);
                nextButtonExist = true;
            }
            catch (err) {
                nextButtonExist = false;
                console.log(`${bookName} DONE!`);
            }
            if (nextButtonExist) {
                await page.click('.navigation > a:last-child');   
                return scrapeCurrentPage();
            }
            await page.close();
        }
        await scrapeCurrentPage();
        return bookName;
    }
}

module.exports = scraperObject;