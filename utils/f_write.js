const fs = require('fs')

function fw(content){
    fs.writeFile('../assets/cat.txt',content,{
        flag:'a',
        encoding:'utf-8'
    },(err)=>{
        if(err) console.log('文件写入失败了...')
        console.log('文件写入成功')
    })
}

exports.fww = fw;