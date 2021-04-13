const puppeteer = require('puppeteer')
// import puppeteer from 'puppeteer'

const srctoimg = require('../../utils/srctoimg.js')
const { mn } = require('../../mnpath/mn.js')

//获取百度的图片
let url = 'https://image.baidu.com/'
async function pup() {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage();
    await page.goto(url);

    await page.setViewport({
        width: 1920,
        height: 1080
    })

    await page.focus('#kw')
    await page.keyboard.sendCharacter('狗')

    await page.click('.s_newBtn')
    console.log('提交搜索')

    let value = []
    await page.on('load', async () => {
        console.log('图片页面加载完')
        value = await page.$$eval('#imgid .imgitem .imgbox .main_img', (elem) => {
            let vv = []
            elem.forEach((item) => {
                vv.push(item.src)
            })
            return vv
        })
        console.log('图片数：' + value.length)
        value.forEach(async (src) => {
            await srctoimg(src, mn);  
        })
        await browser.close();
    })
}

exports.pup = pup;