const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';
const fs = require('fs-extra');

//https://www.mogu.com/
const getItem = async () => {
    const browser = await puppeteer.launch({headless:false,defaultViewport:null});

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');
    //'https://list.mogu.com/book/clothing/50243'
    await page.goto('https://www.mogu.com/');
    // await page.waitForSelector();
    await page.waitForSelector('#views');
    let button = await page.$('#views .column-merge-wrap .item-shadow .word-wrap > a');
    await button.click();
    await page.waitForSelector('#J_scroll_wallbox');

    const atext = await page.$eval('#J_Dynmod_pi7kxy7j_2 > .goods-item .img',a=>a.href);
    console.log(atext)
    
}

module.exports = {
    getItem
}