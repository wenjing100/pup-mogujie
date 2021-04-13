const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writefile = promisify(fs.writeFile);

module.exports = async ( src, dir, aname = null) => {
    if(/\.(png|jpg|gif|jpeg)$/.test(src)){
        console.log('-----jpg-----')
        await urlToImg( src, dir, aname );
    }else{
        console.log('-----base64-----')
        await base64ToImg( src, dir, aname );
    }
}
const urlToImg = async ( src, dir, n)=>{
    const mod = /^https:/.test(src)? https : http;
    const ext = path.extname(src);
    let f1 = n?n:Date.now();
    const file = path.join(dir,`${f1}${ext}`);

    mod.get(src, res=>{//请求图片
        //并将数据流pipe进文件流？
        // console.log('请求到数据了,存在：'+file)
        res.pipe(fs.createWriteStream(file).on('finish',()=>{
            console.log(file)
        }))
    })
}

const base64ToImg = async ( base64Str, dir, n)=>{
    //base64文件的一般形式:
    //data:image/jpeg;base64,/9
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    try{
        const ext = matches[1].split('/')[1].replace('jpeg','jpg');
        let f1 = n?n:Date.now();
        const file = path.join(dir,`${f1}.${ext}`);
        await writefile( file, matches[2], 'base64');
        console.log(file);
    }catch(ex){
        console.log('非法base64')
    }
    
}