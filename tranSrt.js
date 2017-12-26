const tjs = require('translation.js')
const fs = require('fs')
function timeout(t){
    return new Promise((ok,e)=>{
        setTimeout(ok, t)
    })
}
let reg = function(str){
    return /[^, -->\d:]+/.test(str)
}
function tranSrt(n){
    fs.readFile(__dirname + '/twice+upon+a+time.srt', 'utf8', async (err, data) => {
        let dataList = data.split('\r\n')
        let L = dataList.length
        // dataList.map(async da =>{
        //     while(L<=0){
        //         await timeout(500)
        //     }
        //     if ( reg( da ) ) {
        //         let result = await tjs.translate(da)
        //         da = result.result
        //         L--
        //     }

        // })
        for (i in dataList) {
            if ( reg( dataList[i] ) ) {
                let result = await tjs.translate(dataList[i])
                dataList[i] = result.result
            }
            console.log(L--+'/'+dataList.length)
        }
        // }
        let newdata = dataList.join('\r\n')
        fs.writeFile(__dirname+'/newsrt.srt',newdata)
    })
    // return tjs.translate({     text: thisTranString,     api: api,     from:
    // tranF,     to: tranT   }).then(result => {     if(!result.result){
    // return ''     }     if(value.le
}
tranSrt()