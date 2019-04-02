#!/usr/bin/env node
const fs = require('mz/fs');
const tjs = require('translation.js-fix');
const path = require('path');
const chunk = require('lodash.chunk');

function timeout(t) {
  return new Promise((resolve, reject) => {
    setTimeout(ok, t);
  });
}
const reg = function(str) {
  // \d*:\d.* --> \d*:\d*.*\d
  // [^, -->.*\d:]+
  return !/\d*:\d.* --> \d*:\d*.*\d/.test(str) && !onlyNum(str);
};

const onlyNum = n => {
  try {
    return Number.isSafeInteger(+n);
  } catch {
    return false;
  }
};

const APIs = ['google', 'baidu'];

async function tranSrt(fileP) {
  let errMsg = [];
  // read file
  let data = await fs.readFile(fileP, 'utf8');

  const dataList = data.split('\n');
  let needs = {};

  // collect need to translate values
  for (let i in dataList) {
    // regex no number with time
    if (reg(dataList[i])) {
      needs[i] = dataList[i];
    }
  }
  // translate all value in needs Type: {num: value}
  let allValue = Object.values(needs);
  let allIndex = Object.keys(needs);
  let chunkIdx = chunk(allIndex, 30);
  let chunkVal = chunk(allValue, 30);
  console.log(chunkIdx.length,chunkVal.length)

  for (let idx in chunkVal) {
    let singleChunk = chunkVal[idx];
    let result = false;
    for (let api of APIs) {
      try {
        result = await tjs[api].translate(singleChunk.join('\n'));
      } catch (e) {
        result = false;
      }
      if (result) {
        singleChunk = result.result;
      }

      if (result && result.result.length) {
        // set back to source dataList
        chunkIdx[idx].forEach(index => {
          dataList[index] = singleChunk.shift();
        });
        console.log(`${api} ${(+idx + 1) * 30}, ✅`);
        break;
      }else{
        console.log(`${api} ${(+idx + 1) * 30}, ❌`);
      }
    }
    !result && errMsg.push(`${(+idx + 1) * 30}，失败`);
  }

  return [dataList.join('\n'), errMsg];
}

(async () => {
  function insert_flg(str, flg, Uindex) {
    let newstr = '';
    if (!str || !flg) {
      throw TypeError('filename<' + str + '> can not add' + flg);
    }
    let len = str.length;
    let tmp = str.substring(0, len - Uindex);
    newstr = tmp + flg + str.substring(len - Uindex, len);
    return newstr;
  }

  if (process.argv[2]) {
    let fileP = path.resolve(process.argv[2]);

    if (await fs.existsSync(insert_flg(fileP, `.zh`, 4))){
       console.log(`已翻译, 不覆盖 ${fileP}`)
       return
    }

    let [newdata, err = [] ] = await tranSrt(fileP);

    if (err.length > 0) {
      console.error(err)
    } else {
      let saveF = `${insert_flg(fileP, `.zh`, 4)}`;
      console.log(saveF, 'save 🧡');
      await fs.writeFile(saveF, newdata);
      
      console.log(`${fileP}，成功`);
    }
  } else {
    console.error('Error: input source Srt file path');
  }
})();
