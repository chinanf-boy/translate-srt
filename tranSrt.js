#!/usr/bin/env node
const fs = require('mz/fs');
const tjs = require('translation.js-fix');
const path = require('path');
const chunk = require('lodash.chunk');

// log
const {cliOpt} = require('./logOpt.js');
const twoLog = require('two-log-min');
let Log;

const reg = function(str) {
  // \d*:\d.* --> \d*:\d*.*\d
  // [^, -->.*\d:]+
  str = str.trimEnd();
  return (
    !/\d*:\d.* --> \d*:\d*.*\d/.test(str) && !onlyNumOrEnd(str) 
  );
};

const onlyNumOrEnd = n => {
  try {
    return Number.isSafeInteger(+n) && !n.endsWith(".")
  } catch {
    return false;
  }
};

const APIs = ['google', 'baidu'];

async function tranSrt(data) {
  let errMsg = [];
  // read file
  const dataList = data.split('\n');
  let needs = {};

  // collect need to translate values
  for (let i in dataList) {
    // regex no number with time
    if (reg(dataList[i])) {
      needs[i] = dataList[i];
    }
  }
  console.log(needs)

  process.exit()
  // translate all value in needs Type: {num: value}
  let allValue = Object.values(needs);
  let allIndex = Object.keys(needs);
  let ChunkSize = 20;
  let chunkIdx = chunk(allIndex, ChunkSize);
  let chunkVal = chunk(allValue, ChunkSize);
  Log(`idxL: ${chunkIdx.length} , valL: ${chunkVal.length}`);
  let allTran = [];
  for (let idx in chunkVal) {
    let singleChunk = chunkVal[idx];
    let result = false;
    for (let api of APIs) {
      try {
        let tjsOpts = {
          text: singleChunk.join('\n'),
          to: "zh-CN"
          }
        result = await tjs[api].translate(tjsOpts);
      } catch (e) {
        result = false;
      }
      if (result && result.result.length == singleChunk.length) {
        singleChunk = result.result;
        // collect
        allTran = allTran.concat(singleChunk);
        
        Log(`${api} ${(+idx + 1) * ChunkSize}, ^-^`);
        break;
      } else {
        Log(`${api} ${(+idx + 1) * ChunkSize}, ·_~～～`);
      }
    }
    !result && errMsg.push(`${(+idx + 1) * ChunkSize}，失败`);
  }

  if(allTran.length == allValue.length){
    allIndex.forEach(i =>{
      // set back to source dataList
      dataList[i] = allTran.shift()
      console.log(i)
    })
  }
  console.log(dataList)

  return [dataList.join('\n'), errMsg];
}

(async () => {
  const {insert_flg} = require('./util.js');
  const fileSub = ['srt']; // 格式

  let D,
    R = false;
  process.argv.forEach(arg => {
    if (arg == '-D') {
      D = true;
    } else if (arg == '-R') {
      R = true;
    }
  });
  const l = twoLog(D);

  async function run() {
    if (process.argv[2]) {
      let fileP, data;
      try {
        // fix: Error file path
        fileP = path.resolve(process.argv[2]);
        data = await fs.readFile(fileP, 'utf8');
      } catch (e) {
        return '❌' + e;
      }

      Log = l.start(`start transalte ${fileP}`, cliOpt);

      if (fileP.endsWith('.zh.srt')) {
        l.one(`翻译文件, 不覆盖 ${fileP}`);
        return;
      }

      if (!R) {
        if (await fs.existsSync(insert_flg(fileP, `.zh`, fileSub[0].length))) {
          // 若已有，提前返回，
          l.one(`已翻译, 不覆盖 ${fileP}`);
          // stop 必须有
          return;
        }
      }


      let [newdata, err] = await tranSrt(data);

      if (err.length > 0) {
        console.error(err);
      } else {
        let saveF = `${insert_flg(fileP, `.zh`, fileSub[0].length)}`;
        Log(saveF + 'save 🧡', {only: 'log'});
        await fs.writeFile(saveF, newdata);
        l.one(`翻译成功，位于：${saveF}`);
      }
    } else {
      return ' ❌ Error: input source Srt file path';
    }
  }
  // run
  let err = await run();

  // two-log-min 的生命是 1.start 2. text 3.stop。不然 ora 就会 一直转
  l.stop();

  if (err) {
    console.error(err);
    process.exit(1);
  }
})();
