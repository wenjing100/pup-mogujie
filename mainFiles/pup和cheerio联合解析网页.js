const puppeteer = require('puppeteer');
const fs = require('fs');
const getresult = require('../dataBase/mysqlop.js');

let myurl = 'http://book.dangdang.com/';
let myselector = '#hd .sub ul li a';

async function spider(){
    let browser = await puppeteer.launch();//{headless:false}
    let page = await browser.newPage();

    await page.goto(myurl);
    
    console.log('第一步=======')
    let {values,urls} = await page.$$eval(myselector,(elem)=>{
        let values =[]
        let urls = []
        let i = 2;//第几行开始
        elem.forEach((item)=>{
            values.push(`insert into test01 values(${i},"${item.href}","${item.innerHTML}");`);
            urls.push(item.href);
          i++;
        })
        return { values, urls }
    })
    // console.log(values)
    // console.log(urls)

    for(let i = 0; i < values.length; i++){
        console.log('第二步======插入数据行'+i)
        await getresult(values[i]);
    }
    await browser.close();
}

exports.fn1 = spider