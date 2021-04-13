const { copySync } = require('fs-extra');
const puppeteer = require('puppeteer');
const { getresult, getShopId } = require('../../dataBase/mysqlop.js')
const { randomStr } = require('../../hooks/生成随机字符串.js')

//'https://list.mogu.com/book/clothing/50273?acm=&ptp='//卫衣 15
//'https://list.mogu.com/book/clothing/50243?acm=&ptp=' //套装 9----重来
//'https://list.mogu.com/book/clothing/50206?acm=&ptp=' //牛仔裤 33
//'https://list.mogu.com/book/clothing/50244?acm=&ptp=' //T恤 18
//'https://list.mogu.com/book/skirt/10061956?acm=' //连衣裙 21
//'https://list.mogu.com/book/neiyi/50025?acm=' //内衣 46
//'https://list.mogu.com/book/clothing/50240?acm=&ptp=' //上衣 4
const baseurl = 'https://list.mogu.com/book/neiyi/50025?acm=' //内衣 46

const getItem = async () => {
  let a_list = await getlen(baseurl);
  let len = a_list.alink.length;
  console.log(len);
  const browser = await puppeteer.launch({
    headless: true,
    args: [//反爬  策略1
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    dumpio: false,
  });
  for (let i = 0; i < len; i++) {
    console.log(a_list.alink[i])
    try {
      let page02 = await browser.newPage();
      await page02.evaluate(//反爬  策略2
        '() =>{Object.defineProperties(navigator,{webdriver:{get: () => false}})}'
      );
      await page02.goto(a_list.alink[i], {
        waitUntil: 'networkidle0' //networkidle2 网络空闲说明已加载完毕
      });//a_list.alink[i]

      let tag = ''
      if(i<len/3){
        tag = '流行';//新款 精选
      }else if (i<len/2){
        tag = '新款';
      }else{
        tag = '精选'
      }
      let shop_id = '';
      let buyer_id = '';
      shop_id = randomStr(8);
      //滚动默认-----详情滚动页面到底部，完成懒加载
      await autoScroll(page02);
      //除了评论的 内容
      let main_items = await page02.evaluate(() => {
        const CAT = 21;
        let shop_details = []
        //店铺名称 name-wrap
        let shop_name = document.querySelector('#header .name-wrap a').innerText;
        //店铺logo
        let logo = document.querySelector('#header .avatar img').src;
        shop_details.push(shop_name, logo)

        let a_lis = document.querySelectorAll('#header .J-shop-user-info-detail .li3 li');
        a_lis.forEach(li => {//店铺详情
          let key = li.firstElementChild.innerText;
          let val = li.lastChild.textContent;
          shop_details.push({ key, val })
        })
        let compare = document.querySelector('#header .J-shop-user-info-detail .li2 .title~li').innerText.replace(/[^0-9.]/ig, '');
        let _text_compare = document.querySelector('#header .J-shop-user-info-detail .li2 .title~li').innerText.trim()[0];
        let score = document.querySelector('#header .J-shop-user-info-detail .li1 .title~li span').innerText;
        let isBetter = _text_compare == "高" ? true : false;
        //店铺评分
        let shop_score_compare = { isBetter, comrate: compare, shopscore: score };
        let shop_insells = [
          '牛仔裤/休闲裤', '牛仔短裤//热裤',
          '连衣裙/半身裙', '时尚套装',
          '针织/毛衣', '外套',
          '衬衫/雪纺衫', '卫衣',
          '秋冬短裤', 'T恤',
          '秋季新品', '加绒加厚卫衣'
        ];
        /*================================================================*/
        //商品名
        let name = document.querySelector('#body_wrap .goods-title .title').innerText;
        //收藏数
        let likes = document.querySelector('#body_wrap .goods-social .fav-num').innerText;
        //现价
        let price = document.querySelector('#J_NowPrice').innerText.split('~')[0].replace(/[^0-9.]/ig,'');
        //原价
        let marketprice = 0;
        let mkp_elem = document.querySelector('#J_OriginPrice');
        if(mkp_elem){
          marketprice = document.querySelector('#J_OriginPrice').innerText.split('~')[0].replace(/[^0-9.]/ig,'');
        }
        //库存
        let inventory = document.querySelector('#J_GoodsSku .J_GoodsStock').innerText.replace(/[^0-9]/ig, "");
        //色彩
        let colors = [];
        document.querySelectorAll('#J_GoodsSku .style-list li').forEach(li => {
          colors.push(li.innerText)
        })
        //尺码
        let sizes = [];
        document.querySelectorAll('#J_GoodsSku .size-list li').forEach(li => {
          sizes.push(li.innerText)
        })
        //服务和付款方式
        let service = [];
        let pay = 'ali,weichat';
        document.querySelectorAll('#J_GoodsInfo .extra-services .item .link').forEach(link => {
          service.push(link.innerText);
        })
        let topImgs = [];
        let childlen = document.querySelectorAll('#J_GoodsImg>div').length;
        if(childlen>1){
          document.querySelectorAll('#J_GoodsImg .small-img li img').forEach(img => {
            let ss = img.src.replace(/_100x100.jpg$/ig, '');
            topImgs.push(ss);
          })
        }
        let f_img = document.querySelector('#J_GoodsImg .big-img img').src;
        let parms = []
        document.querySelectorAll('#J_ParameterTable td').forEach(td => {
          let k_v = td.innerText.split(':');
          parms.push(`${[k_v[0]]}:${k_v[1]}`)
        })

        let des_text = '';
        if (document.querySelector('#J_Graphic_desc')) {
          des_text = document.querySelector('#J_Graphic_desc .graphic-text').innerText;
        }
        //产品描述图片
        let des_imgs = []
        document.querySelectorAll('#J_ModuleGraphic .graphic-block img').forEach(img => {
          des_imgs.push(img.src);
        })
        let goods_cat = CAT;
        let grand_total = document.querySelector('#J_ModulePrice .J_SaleNum').innerText;
        let str = Math.random().toString(36).slice(-8);
        let goods_id = str;
        let goods_details = {
          name,
          likes,
          service,
          pay,
          colors,
          sizes,
          price,
          marketprice,
          inventory,
          topImgs,
          parms,
          des_text,
          des_imgs,
          goods_cat,
          grand_total,
          goods_id,
          f_img
        }
        return {
          shop_details,
          shop_score_compare,
          shop_insells,
          goods_details,
        }
      })
      let flag = false;
      await getShopId(main_items.shop_details[0], result => {
        if(result){
          let data = JSON.parse(JSON.stringify(result));//{ s_id: 'yr0ae4wyjh' }
          if (data.s_id) {
            shop_id = data.s_id;
            flag = true;
          }
        }
      })

      //点击评论标签 加载评论页面
      let comments_tab = await page02.$('#J_ModuleTabpanel .selected a');
      comments_tab.click();
      //滚动页面到底部，完成懒加载
      await autoScroll(page02);
      //----开始分析页面
      let comment_items = await page02.evaluate(() => {
        //------辅助变量-------
        let b_name = [];
        let b_logo = [];
        let c_d = [];
        let c_com = [''];
        let c_choi = [];
        let ree = document.querySelector('#J_RatesBuyerList .item .info-t .name');
        if (!ree) return;
        document.querySelectorAll('#J_RatesBuyerList .item .info-t .name').forEach(span => {
          b_name.push(span.innerText);
        })
        let u_logo = document.querySelectorAll('#J_RatesBuyerList .item .face img').forEach(img => {
          b_logo.push(img.src);
        });
        document.querySelectorAll('#J_RatesBuyerList .item .info-t .date').forEach(span => {
          let mm = span.innerText.replace(/日/ig, '').replace(/[^0-9]/ig, '-');
          let nn = new Date(mm);
          c_d.push(nn);
        })
        document.querySelectorAll('#J_RatesBuyerList .item .info-m').forEach(div => {
          c_com.push(div.innerText);
        });
        document.querySelectorAll('#J_RatesBuyerList .item .sku-choose').forEach(span => {
          c_choi.push(span.innerText);
        })
        return {
          b_name,
          b_logo,
          c_d,
          c_com,
          c_choi
        }
      })

      console.log(i);
      console.log('==========================================');
      if(!a_list.face_imgs[i]){
        a_list.face_imgs[i] = main_items.goods_details.f_img;
      }
      if(main_items.goods_details.topImgs.length==0){
        main_items.goods_details.topImgs.push(a_list.face_imgs[i]);
      }
      let sql_goods_details = `insert into goods_details(iid,shop_id,g_name,colors,likes,sizes,price,marketprice,inventory,top_imgs,describe_text,describe_imgs,cat,grand_total,params,tag,face_img)
			values(
			  '${main_items.goods_details.goods_id}',
			  '${shop_id}',
			  '${main_items.goods_details.name}',
			  '${main_items.goods_details.colors.toString()}',
			  ${main_items.goods_details.likes},
			  '${main_items.goods_details.sizes.toString()}',
			  ${main_items.goods_details.price},
			  ${main_items.goods_details.marketprice},
			  ${main_items.goods_details.inventory},
			  '${main_items.goods_details.topImgs.toString()}',
			  '${main_items.goods_details.des_text}',
			  '${main_items.goods_details.des_imgs.toString()}',
			  ${main_items.goods_details.goods_cat},
			  ${main_items.goods_details.grand_total},
			  '${main_items.goods_details.parms.toString()}',
        '${tag}',
        '${a_list.face_imgs[i]}'
			   )`
      //存入 goods_detail表
      getresult(sql_goods_details);

      //赋值循环
      let circleLen = comment_items == null? 0 :comment_items.b_name.length;
      for (let k = 0; k < circleLen; k++) {
        let str = Math.random().toString(36).slice(-6);
        buyer_id = str;
        let sql_comment = `insert into goods_comments(goods_id,buyer_id,goods_parms,comments,comments_imgs) values(
					'${main_items.goods_details.goods_id}',
					'${buyer_id}',
					'${comment_items.c_choi[k]}',
					'${comment_items.c_com[k]}',
					'');`
        getresult(sql_comment);
        let sql_buyers = `insert into buyers(b_id,buyer_name,logo) values(
					'${buyer_id}',
					'${comment_items.b_name[k]}',
					'${comment_items.b_logo[k]}'
				);`
        getresult(sql_buyers);
      }
      if (!flag) {
        let sql_shops = `insert into shops(s_id,s_name,s_score,isBetter,compareRate,s_logo,category,s_address,likes,goods_num,total_sells) values(
					'${shop_id}',
					'${main_items.shop_details[0]}',
					${parseFloat(main_items.shop_score_compare.shopscore)},
					${main_items.shop_score_compare.isBetter},
					${parseFloat(main_items.shop_score_compare.comrate)},
					'${main_items.shop_details[1]}',
					'${main_items.shop_insells.toString()}',
					'${main_items.shop_details[2].val}',
					${main_items.shop_details[4].val},
					${main_items.shop_details[3].val},
					${main_items.shop_details[5].val});`
        getresult(sql_shops);
      }

      let sql_service = `insert into services_payment(goods_id,pay_way,services) values(
        '${main_items.goods_details.goods_id}',
        '${main_items.goods_details.pay}',
        '${main_items.goods_details.service.toString()}'
        );`;
      getresult(sql_service);
    } catch (err) {
      console.log("出错了！！" + err)
    }
  }
  console.log('结束了~~')
  await browser.close()
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
async function autoScrollto10000(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        // var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= 20000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

const getlen = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page01 = await browser.newPage();
  await page01.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.0 Safari/537.36');
  await page01.goto(url,{
    waitUntil: 'networkidle0'
  });
  // 滚动到底部
  await autoScrollto10000(page01);
  await waitMe(2000);
  const dim = await page01.evaluate(() => {
    links = [];
    face_imgs = [];
    let ass = Array.from(document.querySelectorAll('#J_scroll_wallbox .goods_item a.img'));
    ass.forEach(a => {
      links.push(a.href);
    })
    document.querySelectorAll('#J_scroll_wallbox .goods_item a.img img').forEach(img => {
      face_imgs.push(img.src);
    })
    return {
      alink: links,
      face_imgs
    }
  })
  await browser.close();
  // console.log(dim)
  return dim
}
const waitMe = async (t)=>{
  let id = null;
  return new Promise((res,rej)=>{
    id = setTimeout(()=>{
      clearTimeout(id);
      id = null;
      res()
    },t)
  })
}
const run = async () => {
  await getItem()

}
module.exports = {
  run
}