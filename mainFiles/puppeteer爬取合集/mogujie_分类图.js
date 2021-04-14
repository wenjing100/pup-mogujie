const puppeteer = require('puppeteer');
const { getresult } = require('../../dataBase/mysqlop.js')

const baseurl = 'https://www.mogu.com/' //蘑菇街主页

const getItem = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  let page02 = await browser.newPage();
  await page02.goto(baseurl, {
    waitUntil: 'networkidle0' //networkidle2 网络空闲说明已加载完毕
  });
  try {
    const dim = await page02.evaluate(() => {
      let aa = []
      document.querySelectorAll('#views .cate-word-wrap .cate-item-link').forEach(a => {
        let name = a.title.trim();
        let img = a.style.backgroundImage.split('"')[1];
        aa.push({
          cat_name: name,
          pic: img
        })
      })
      return aa
    })
    console.log(dim)
    for(let i = 0; i < dim.length; i++){
      let sql = `insert into catagory_show(cat_name,pic) values(
      '${dim[i].cat_name}','${dim[i].pic}');`;  
      getresult(sql);
    }
  } catch (err) {
    console.log("出错了！！" + err)
  }
  console.log('结束了~~')
  await browser.close()
}

const run = async () => {
  await getItem()
}
module.exports = {
  run
}