const get_demo = async () => {
	//商品名
	let name = document.querySelector('#body_wrap .goods-title .title').innerText;
	//收藏数
	let likes = document.querySelector('#body_wrap .goods-social .fav-num').innerText;
	//现价
	let price = document.querySelector('#J_NowPrice').innerText.split('¥')[1];
	//原价
	let marketprice = document.querySelector('#J_OriginPrice').innerText.split('¥')[1];
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
	let service_pay = [];
	service_pay.push({ alipay: true }, { weichatpay: true }, { bankcardpay: false });
	document.querySelectorAll('#J_GoodsInfo .extra-services .item .link').forEach(link => {
		service_pay.push({ service: link.innerText });
	})
	for (let i = 0; i < 11; i++) {
		if (!service_pay[i]) {
			service_pay[i] = null;
		}
	}
	let topImgs = [];
	document.querySelectorAll('#J_GoodsImg .small-img li img').forEach(img => {
		let ss = img.src.replace(/_100x100.jpg$/ig, '');
		topImgs.push(ss);
	})

	let parms = []
	document.querySelectorAll('#J_ParameterTable td').forEach(td => {
		let k_v = td.innerText.split(':');
		parms.push({ [k_v[0]]: k_v[1] })
	})
	for (let j = 0; j < 15; j++) {
		if (!parms[j]) {
			parms[j] = null;
		}
	}
	let des_text = '';
	if (document.querySelector('#J_Graphic_desc')) {
		des_text = document.querySelector('#J_Graphic_desc .graphic-text').innerText;
	}
	//产品描述图片
	let des_imgs = []
	//滚动页面
	for (var y = 0; y <= 8000; y += 100) {
		window.scrollTo(0, y)
	}
	document.querySelectorAll('#J_Graphic_图文详情 img').forEach(img => {
		let middle = img.src;
		des_imgs.push(middle);
	})
	let cat = 15;
	let grand_total = document.querySelector('#J_ModulePrice .J_SaleNum').innerText;
	let demo = {
		name,
		likes,
		service_pay,
		colors,
		sizes,
		price,
		marketprice,
		inventory,
		topImgs,
		parms,
		des_text,
		des_imgs,
		cat,
		grand_total
	}
}
const get_shopinfo = async () => {
	//店铺一般信息
	let details = []
	//店铺名称 name-wrap
	let shop_name = document.querySelector('#header .name-wrap a').innerText;

	//店铺logo
	let logo = document.querySelector('#header .avatar img').src;
	details.push({ shop_name }, { logo })
	let a_lis = document.querySelectorAll('#header .J-shop-user-info-detail .li3 li');
	a_lis.forEach(li => {
		let key = li.firstElementChild.innerText;
		let val = li.lastChild.textContent;
		details.push({ key, val })
	})
	let compare = document.querySelectorAll('#header .J-shop-user-info-detail .li2 li')[1].innerText.replace(/[^0-9.%]/ig, '');
	let score = document.querySelectorAll('#header .J-shop-user-info-detail .li1 li')[1].innerText.replace(/[^0-9.]/ig, '');
	let isBetter = compare[0] == "高" ? true : false;
	//店铺评分
	let shop_score_compare = { isBetter, comrate: compare, shopscore: score };
	let cats = [];
	//店铺商品分类
	document.querySelector('.J-shop-top-nav .category-list').style.display = 'block';
	document.querySelectorAll('.J-shop-top-nav .category-list li a').forEach(a => {
		cats.push(a.innerText)
	})
}
const get_C_Buyer = () => {
	let comLists = [];
	let buyers = [];
	let u_name = document.querySelector('#J_RatesBuyerList .item .info-t .name').innerText;
	let u_logo = document.querySelector('#J_RatesBuyerList .item .face img').src;
	let str_date = document.querySelector('#J_RatesBuyerList .item .info-t .date').innerText.replace(/日/ig, '').replace(/[^0-9]/ig, '-');
	let u_date = new Date(str_date);
	let content = document.querySelector('#J_RatesBuyerList .item .info-m').innerText;
	let buyer_choice = document.querySelector('#J_RatesBuyerList .item .sku-choose').innerText;
	let showimgs = [];
	console.log('a');
	let str = Math.random().toString(36).slice(-6);
	console.log(str);
	buyer_id = str;

	buyers.push({
		b_id: buyer_id,
		buyer_name: u_name,
		logo: u_logo
	})
	console.log(buyers)
	comLists.push({
		buyer_id: buyer_id,
		goods_parms: buyer_choice,
		comments: content,
		comments_imgs: showimgs,
		comment_time: u_date.getTime()
	})
}

try {
	let page02 = await browser.newPage();
	//反爬  策略2
	await page02.evaluate(
		'() =>{Object.defineProperties(navigator,{webdriver:{get: () => false}})}'
	);
	let ll = 'https://shop.mogu.com/detail/1mva19k?acm=3.ms.1_4_1mva19k.15.1343-102817-68998.mLA6GssFIDmuP.sd_117-swt_15-imt_6-c_1_3_585028926_0_0_3-t_mLA6GssFIDmuP-lc_3-fcid_50273-pid_180-pit_1-dit_-idx_2-dm1_5002&cparam=MTYxNjY3NDc4M18xMWtfNDg2MjI1Y2ViY2U5MDRjZWFlMWI3ZWMzMmIyNjU0OGNfM18wXzU4NTAyODkyNl80ZjhkXzBfMF8wXzQ5NV8xXzNfbG9jLTA=&ptp=31.q0vvrb.0.0.J08Sek5A'
	await page02.goto(ll, {
		waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
	});//a_list.alink[i]

	//滚动页面到底部，完成懒加载
	await autoScroll(page02);

	let shop_id = '';
	let goods_id = '';
	let buyer_id = '';
	let shopnames = [];
	//商品 id
	goods_id = randomStr(8);
	//店铺 id
	shop_id = randomStr(10);
	//----开始分析页面
	let All_items = await page02.evaluate(() => {
		let comLists = [];
		let buyers = [];
		let u_name = document.querySelector('#J_RatesBuyerList .item .info-t .name').innerText;
		let u_logo = document.querySelector('#J_RatesBuyerList .item .face img').src;
		let str_date = document.querySelector('#J_RatesBuyerList .item .info-t .date').innerText.replace(/日/ig, '').replace(/[^0-9]/ig, '-');
		let u_date = new Date(str_date);
		let content = document.querySelector('#J_RatesBuyerList .item .info-m').innerText;
		let buyer_choice = document.querySelector('#J_RatesBuyerList .item .sku-choose').innerText;
		let showimgs = [];
		console.log('a');
		let str = Math.random().toString(36).slice(-6);
		console.log(str);
		buyer_id = str;

		buyers.push({
			b_id: buyer_id,
			buyer_name: u_name,
			logo: u_logo
		})
		console.log(buyers)
		comLists.push({
			buyer_id: buyer_id,
			goods_parms: buyer_choice,
			comments: content,
			comments_imgs: showimgs,
			comment_time: u_date.getTime()
		})
		/*================================================================*/
		//店铺一般信息
		let details = []
		//店铺名称 name-wrap
		let shop_name = document.querySelector('#header .name-wrap a').innerText;

		//店铺logo
		let logo = document.querySelector('#header .avatar img').src;
		details.push({ shop_name }, { logo })
		let a_lis = document.querySelectorAll('#header .J-shop-user-info-detail .li3 li');
		a_lis.forEach(li => {
			let key = li.firstElementChild.innerText;
			let val = li.lastChild.textContent;
			details.push({ key, val })
		})
		let compare = document.querySelectorAll('#header .J-shop-user-info-detail .li2 li')[1].innerText.replace(/[^0-9.%]/ig, '');
		let score = document.querySelectorAll('#header .J-shop-user-info-detail .li1 li')[1].innerText.replace(/[^0-9.]/ig, '');
		let isBetter = compare[0] == "高" ? true : false;
		//店铺评分
		let shop_score_compare = { isBetter, comrate: compare, shopscore: score };
		let cats = [];
		//店铺商品分类
		document.querySelector('.J-shop-top-nav .category-list').style.display = 'block';
		document.querySelectorAll('.J-shop-top-nav .category-list li a').forEach(a => {
			cats.push(a.innerText)
		})
		/*================================================================*/
		//商品名
		let name = document.querySelector('#body_wrap .goods-title .title').innerText;
		//收藏数
		let likes = document.querySelector('#body_wrap .goods-social .fav-num').innerText;
		//现价
		let price = document.querySelector('#J_NowPrice').innerText.split('¥')[1];
		//原价
		let marketprice = document.querySelector('#J_OriginPrice').innerText.split('¥')[1];
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
		let service_pay = [];
		service_pay.push({ alipay: true }, { weichatpay: true }, { bankcardpay: false });
		document.querySelectorAll('#J_GoodsInfo .extra-services .item .link').forEach(link => {
			service_pay.push({ service: link.innerText });
		})
		for (let i = 0; i < 11; i++) {
			if (!service_pay[i]) {
				service_pay[i] = null;
			}
		}
		let topImgs = [];
		document.querySelectorAll('#J_GoodsImg .small-img li img').forEach(img => {
			let ss = img.src.replace(/_100x100.jpg$/ig, '');
			topImgs.push(ss);
		})

		let parms = []
		document.querySelectorAll('#J_ParameterTable td').forEach(td => {
			let k_v = td.innerText.split(':');
			parms.push({ [k_v[0]]: k_v[1] })
		})
		for (let j = 0; j < 15; j++) {
			if (!parms[j]) {
				parms[j] = null;
			}
		}
		let des_text = '';
		if (document.querySelector('#J_Graphic_desc')) {
			des_text = document.querySelector('#J_Graphic_desc .graphic-text').innerText;
		}
		//产品描述图片
		let des_imgs = []
		//滚动页面
		for (var y = 0; y <= 8000; y += 100) {
			window.scrollTo(0, y)
		}
		document.querySelectorAll('#J_Graphic_图文详情 img').forEach(img => {
			let middle = img.src;
			des_imgs.push(middle);
		})
		let goods_cat = 15;
		let grand_total = document.querySelector('#J_ModulePrice .J_SaleNum').innerText;
		let demo = {
			name,
			likes,
			service_pay,
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
			grand_total
		}
		return {
			comLists,
			buyers,
			details,
			shop_score_compare,
			cats,
			demo
		}
	})
	console.log(All_items);
	let sqlstr = ``;
	// getresult(sqlstr);
} catch (err) {
	console.log("出错了！！" + err)
}

// document.querySelector('.J-shop-top-nav .category-list').style.display = 'block';
//移动鼠标------让在售商品列表显示
let a_tab = await page02.$('.J-top-nav-title:nth-of-type(2)');
let box = await a_tab.boundingBox();
let x = box.x + (box.width / 2);
let y = box.y + (box.height / 2);
await page02.mouse.move(x, y);