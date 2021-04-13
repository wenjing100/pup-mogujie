const connection = require('./config.js');

async function getresult(sql) {
  await connection.query(sql, (err, rows) => {
    if (err) {
      console.log("mysql出错了！！" + err)
    }
    console.log('存入mysql');
    // console.log('The solution is: ', rows)
  })
}

async function getShopId(shopname,callback) {
  let sql = `select s_id from wenjing_01.shops where s_name = '${shopname}'`;
  return await connection.query(sql,(err,rows)=>{
    if(err){
      console.log("没有对应店铺"+err)
      return "sql没找到"
    }
    callback(rows[0])
  })
  
}
exports.getShopId = getShopId;
exports.getresult = getresult;