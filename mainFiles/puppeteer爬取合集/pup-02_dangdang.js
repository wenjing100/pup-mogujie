const puppeteer = require('puppeteer')
// import puppeteer from 'puppeteer'
const { bp,bpfile } = require('../../mnpath/mn.js')
const srctoimg = require('../../utils/srctoimg.js')
const fs = require('fs')
const fn = require('../../dataBase/mysqlop.js')


async function main () {
    let pids = [
    {pid:'01.03.htm',selector:'#component_850577__6407_6396_6394__6394 li',tag:'小说'},
    {pid:'01.22.htm',selector:'#component_852197__6407_6396_6394__6394 li',tag:'管理'},
    {pid:'01.21.htm',selector:'#component_852138__6407_6396_6394__6394 li',tag:'成功/励志'},
    {pid:'01.07.htm',selector:'#component_850671__6407_6396_6394__6394 li',tag:'绘画艺术'}]
    for(let i = 0; i < pids.length; i++){
        await pup(pids[i].pid,pids[i].selector,pids[i].tag);
    } 
}

async function pup(pid,selector,tag) {
    const brower = await puppeteer.launch();
    const page = await brower.newPage()
    await page.goto(`http://book.dangdang.com/${pid}`)

    let books = await page.$$eval(selector,(elems)=>{
        let vv = []
        elems.forEach(item => {
            let Url = item.children[0].firstChild.src;
            let Bname = item.children[1].firstChild.innerHTML;
            let Author = item.children[2].innerText;
            let Price = item.children[3].children[1].children[1].innerHTML;
            vv.push({
                bookname:Bname,
                bookimgurl:Url,
                author:Author,
                price:Price
            });
        });
        return vv
    })
    console.log('获取到的书本数：'+books.length);

    let bf = Buffer.from(JSON.stringify(books)+',');
    fs.writeFile(`${bpfile}/booklists.js`,bf,{flag:'a'},(err)=>{
        if(err)console.log(err)
        console.log('data数据保存了')
    });//将数据写入文件

    books.forEach(async (item)=>{
        let sql = `insert into books(bookname,author,price,imgurl,tag) values("${item.bookname}","${item.author}",${item.price},"${item.bookimgurl}","${tag}");`

        await srctoimg(item.bookimgurl, bp, item.bookname); //下载对应图片
        await fn.getresult(sql);//存入数据库
    })
    await brower.close();
}

module.exports = {
    main
}