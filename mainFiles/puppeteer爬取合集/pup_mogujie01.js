const puppeteer = require('puppeteer');
const {getresult} = require('../../dataBase/mysqlop.js')
//'https://list.mogu.com/book/clothing/50243'

const baseurl = 'https://list.mogu.com/book/clothing/50243'
const getItem = async ()=>{
    let a_list = await getlen(baseurl);
    let len = a_list.alink.length;
    console.log(len)
    let datalist = []
    const browser = await puppeteer.launch({headless:true});
    for(let i = 0; i < len; i++){
        console.log('i：'+i);
        try {
            let page02 = await browser.newPage();
            await page02.goto(a_list.alink[i]);
            let demo = await page02.evaluate(()=>{
                let goods_name = document.querySelector('#J_GoodsInfo .goods-title').innerText;

                let p0 = document.querySelector('#J_NowPrice')?document.querySelector('#J_NowPrice').innerText.split('¥')[1]:0;
                let priceNow = parseFloat(p0);
                
                let p1 =document.querySelector('#J_OriginPrice')?document.querySelector('#J_OriginPrice').innerText.split('¥')[1]:0;
                let priceMarket = parseFloat(p1);
                
                let md = document.querySelector('#J_GoodsSku .J_GoodsStock').innerText
                let inventory = md.replace(/[^0-9]/ig,"");
               
                let bg_img = document.querySelector('#J_BigImg').src;

                let small_imgs = []
                document.querySelectorAll('#J_SmallImgs li img').forEach(img=>{
                    small_imgs.push(img.src);
                })
                let details = []
                document.querySelectorAll('#J_Graphic_图文详情 img').forEach(img=>{
                    details.push(img.src);
                })
                return {
                    goods_name,
                    priceNow,
                    priceMarket,
                    inventory,
                    bg_img,
                    small_imgs,
                    details
                }
            })
            //创建sql 语句
            let imgs = []
            for(let j = 0;j < 5; j++){
                if(demo.small_imgs[j]){
                  imgs.push(demo.small_imgs[j])  
                }else{
                  imgs.push(null)
                }
            }
            console.log(i)
            let sqlstr = `insert into goods_pics
            (goods_id,img_md_1,img_md_2,img_md_3,img_md_4,img_md_5) 
            values(${i},'${imgs[0]}','${imgs[1]}','${imgs[2]}','${imgs[3]}','${imgs[4]}');`
            getresult(sqlstr);
            console.log(demo.priceNow)
            datalist.push(demo)
        } catch (err) {
            console.log("出错了！！"+err)
        }

    }
    await browser.close()
}

const getlen = async (url)=>{
    const browser = await puppeteer.launch({headless:true});
    const page01 = await browser.newPage();
    await page01.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');
    await page01.goto(url);

    const  dim = await page01.evaluate(()=>{
        links = [];
        let ass = Array.from(document.querySelectorAll('#J_scroll_wallbox .goods_item a.img'));
        ass.forEach(a=>{
            links.push(a.href)
        })
        return{
            alink:links
        }
    })
    await browser.close();
    // console.log(dim)
    return dim
}
module.exports = {
    getItem
}