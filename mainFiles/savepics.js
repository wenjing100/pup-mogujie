const fn = require('./learnFiles/get_pics.js.js.js')
const fs = require('fs')
// {
    //     bookname: '灵光集：兰波诗歌集注(当当网定制)',
    //     bookimgurl: 'http://img3m8.ddimg.cn/70/3/29133988-1_l_3.jpg',
    //     author: '[法]阿蒂尔·兰波 著，何家炜 译',
    //     price: '69'
    //   }
fn.fn2().then(data=>{
    console.log(data.length)
    // for(let i = 0; i < data.length; i++){
    //     savep(data[i].bookimgurl,data[i].bookname)
    // }
    savep(data[0].bookimgurl,data[0].bookname)
});

async function savep (url,name) {
    let ws = fs.createWriteStream(`./assets/img/${name}.jpg`,{flags:'w'});
    let rs = fs.createReadStream(url,{flags:'r'});
    let arr = [];
    rs.on('open',(err)=>{
        console.log('------开始读取数据流')
    })

    rs.on('end',(err)=>{
        if(err){
            console.log('=========close的时候'+err)
        }
        // let b = Buffer.concat(arr)
        // ws.write(b,()=>{console.log('~~一张图片成功~~')})
        // ws.end()
        console.log('-------数据流读取结束')
    })
    rs.on('data',(chunk)=>{
        console.log('开始写入数据了~~')
        // arr.push(chunk)
      
    })
}