const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';

const pupFn = function(){
    test();
}

async function test(){
    //创建浏览器    默认.launch()是无界面的
    let browser = await puppeteer.launch({headless:false})
    //创建页面对象  异步过程
    let page = await browser.newPage()
    //打开网页
    await page.goto('https://www.dytt8.net/html/gndy/index.html')
    //可以对网页截屏  screenshot.png图片必须事先存在，然后截屏的时候会覆盖原图
    // await page.screenshot({path: 'screenshot.png'});
    // await page.screenshot({path:'screenshot.png'})
    // await browser.close();

    page.$$eval('#menu .contain ul li a',(elem)=>{
        elem.forEach((item)=>{
            //会在puppeteer页面控制台打印
            console.log(item.origin + item.pathname + item.outerText)
        })
    })

    //页面监听console事件，在终端打印
    page.on('console', (...args)=> {
        console.log(args)
    })
}


exports.fn0 = pupFn