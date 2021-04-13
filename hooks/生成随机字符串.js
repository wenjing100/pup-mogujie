
function randomStr(n){
    let str = Math.random().toString(36).slice(-n);
    return str
}

module.exports = {
    randomStr
}