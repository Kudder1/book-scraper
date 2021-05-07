const axios = require('axios');
const $ = require('cheerio');
const fs = require('fs');

const initialUrl = 'https://gamemodding.com/ru/gta-5';

const MODS = [];
let pagesCount;

async function initialRequest() {
    try {
        const html = await axios.get(`${initialUrl}/?sort=downloads`);
        pagesCount = $('.main-pagi', html.data).children().first().text()
    } catch (error) {
        console.log(`initialRequest ${error.message}`)
    }
}

async function paginationLoop() {
    while (pagesCount !== 292) {
        try {
            console.log(MODS)
            let html = await axios.get(`${initialUrl}/page/${pagesCount}/?sort=downloads`);
            $('.modding-list', html.data).children().each(async(i, el) => {
                let mod = {
                    title: $(el).find('.title').text(),
                    date: $(el).find('.date').text(),
                }
                let full = await axios.get($(el).find('a').attr('href'));
                mod.description = $('.pre-tab', full.data).text();
                MODS.push(mod)
            })
            fs.appendFile('data.json', JSON.stringify(MODS, null, 4), function (err) {
                if (err) return console.log(err);
                console.log('data.json updated');
            });
            pagesCount--
        } catch (error) {
            console.log(`paginationLoop ${error.message}`)
        }
    }
}

async function init() {
    await initialRequest()
    if (pagesCount) paginationLoop()
}

init()