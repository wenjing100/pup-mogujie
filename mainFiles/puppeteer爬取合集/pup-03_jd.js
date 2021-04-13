const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';
const fs = require('fs-extra');

const getItem = async (searchTurn) => {
    const browser = await puppeteer.launch({headless:false,defaultViewport:null});

    const page = await browser.newPage();
    await page.goto(`https://search.jd.com/search?keyword=${encodeURI(searchTurn)}&wq=${encodeURI(searchTurn)}&ev=2342_80745%5E`);
    //&page=1&s=1&click=0---1
    //&page=3&s=61&click=0---2        page+2  60
    //page=5&s=118&click=0---3  s=116      2  55
    //&page=7&s=181&click=0---4            2  65
    //&page=9&s=238&click=0---5            2  57
    //&page=11&s=301&click=0---6           2  63
    //&page=13&s=361&click=0---7           2  60
    //&page=15&s=421&click=0---8           2  60
    //&page=17&s=481&click=0---9           2  60
    //'#J_goodsList li .p-name a'主页的筛选器
    const response = await Promise.all([
        page.waitForNavigation(),
        page.click('#J_goodsList li .p-name > a')
    ])
    console.log(response)
    // let aaa = await page.$$eval('#J_goodsList li .p-name a',a=>{
    //     return a.map(async elem=>{
    //         let text = elem.innerHTML
    //         console.log(text)
    //         return text
    //     })
    // });
    // console.log(aaa[0])
    
   
    
   
 


    // await a_node.click(); // 点击跳转
    // await browser.on('targetcreated',target=>{
    //     let np = target.page();
    //     console.log('新的页面有什么',np)
    // })
    // let newPage =(await browser.pages())[1];
    // await newPage.waitForSelector('#detail');

    
    
    // const lis = await newPage.$$('#detail .tab-con .parameter2 li',elem => {
    //     console.log('列表内容：',elem.innerHTML)
    // });

    

        // a.click();
        // await page.waitForSelector('#detail');

        // const detailLis = await page.$$('#detail .tab-con .parameter2 li')
        // detailLis.forEach(async li =>{
        //     let title = await li.getAttribute('title');
        //     console.log('title:',title)
        // })


        // let text =await a.$eval('em',(em)=>em.innerHTML);
        // console.log(text)
  


//     try {
//         await page.evaluate(()=>{
//             let a_link_nodelist = document.querySelectorAll('#J_goodsList li .p-name a');
//             console.log(a_link_nodelist[0]);
//             a_link_nodelist.click()
//             // elelist[0].innerHTML;
//         })
//     } catch (error) {
//         console.log('出错了啊！',error)
//     }
}

module.exports={
    getItem
}