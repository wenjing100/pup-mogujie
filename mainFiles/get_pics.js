const puppeteer = require('puppeteer')
const fs = require('fs')
const getresult = require('../dataBase/mysqlop.js');

let myurl = 'http://book.dangdang.com/01.03.htm';
let selectors = '#component_850577__6407_6396_6395__6395 li'
    // '#component_850577__6407_6396_6394__6394 li',
    // '#component_850577__6407_6400_6394__6394 li',
    // '#component_850577__6407_6400_6395__6395 li'

async function savepic () {
    let browser = await puppeteer.launch({headless:false});//
    let page = await browser.newPage();
    await page.goto(myurl);
        // let arr = [];
        // let arr1 = [];
        let value =[]
    // for(let i = 0; i < selectors.length; i++){
        // arr1[i] =
        value = await page.$$eval(selectors,(elem)=>{
                let vv = []
                elem.forEach((item)=>{
                    let Price = item.children[3].children[1].children[1].innerHTML;
                    let Bname = item.children[1].firstChild.innerHTML;
                    let Url = item.children[0].firstChild.src;
                    let Author = item.children[2].innerText;
                    vv.push({
                        bookname:Bname,
                        bookimgurl:Url,
                        author:Author,
                        price:Price
                    });
                })
                return vv
            })
        // arr = arr.concat(arr1[i])
    
    return value
}

exports.fn2 = savepic;