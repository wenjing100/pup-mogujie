const puppeteer = require('puppeteer');
const {getresult} = require('../../dataBase/mysqlop.js')
//'https://list.mogu.com/book/clothing/50243'

const baseurl = 'https://list.mogu.com/book/neiyi?ptp=31.vOv15b.0.0.aM0dPTIb'
const getItem = async ()=>{
    let a_list = await getlen(baseurl);
    let len = a_list.alink.length;
    console.log(len)
    const browser = await puppeteer.launch({headless:true});
    let hotpoint = ''
    for(let i = 0; i < len; i++){
        if(i<(len/3)){
            hotpoint = '流行'
        }else if(i<(len*2/3)){
            hotpoint = '新款'
        }else{
            hotpoint = '精选'
        }
        try {
            let page02 = await browser.newPage();
            await page02.goto(a_list.alink[i]);
            let demo = await page02.evaluate(()=>{
                console.log("evaluate")
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
                let cat_1 = 1;
                let cat_2 = 2;
                let cat_3 = 14;
                return {
                    goods_name,
                    priceNow,
                    priceMarket,
                    inventory,
                    bg_img,
                    small_imgs,
                    details,
                    cat_1,
                    cat_2,
                    cat_3,
                }
            })
            //创建sql 语句
            console.log("==")
            console.log(i)
            console.log(demo.cat_1)
            let sqlstr = `insert into goods_test(name,price,marketprice,inventory,img_lg,img_md,details,hp,goods_link,cat_1,cat_2,cat_3) values(
                '${demo.goods_name}',
                ${demo.priceNow},
                ${demo.priceMarket},
                '${demo.inventory}',
                '${demo.bg_img}',
                '${demo.small_imgs}',
                '${demo.details}',
                '${hotpoint}',
                'http://47.110.38.241/',
                ${demo.cat_1},
                ${demo.cat_2},
                ${demo.cat_3}
                );`
            getresult(sqlstr);
            // console.log(demo.goods_name)
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