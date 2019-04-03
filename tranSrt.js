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
  Log(`idxL: ${chunkIdx.length} , valL: ${chunkVal.length}`);

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
        Log(`${api} ${(+idx + 1) * 30}, ^-^`);
        break;
      } else {
        Log(`${api} ${(+idx + 1) * 30}, ·_~～～`);
      }
    }
    !result && errMsg.push(`${(+idx + 1) * 30}，失败`);
  }

  return [dataList.join('\n'), errMsg];
}

(async () => {
  const {insert_flg} = require('./util.js');
  const fileSub = ['srt']; // 格式

  let D,
    R = false;

  if (process.argv[2]) {
    process.argv.forEach(arg => {
      if (arg == '-D') {
        D = true;
      } else if (arg == '-R') {
        R = true;
      }
    });
    let fileP = path.resolve(process.argv[2]);
    const l = twoLog(D);
    Log = l.start(`start transalte ${fileP}`, cliOpt);

    if (!R)
      if (await fs.existsSync(insert_flg(fileP, `.zh`, fileSub[0].length))) {
        // 若已有，提前返回，
        l.one(`已翻译, 不覆盖 ${fileP}`);
        // stop 必须有
        l.stop();
        return;
      }

    let [newdata, err = []] = await tranSrt(fileP);

    if (err.length > 0) {
      console.error(err);
    } else {
      let saveF = `${insert_flg(fileP, `.zh`, fileSub[0].length)}`;
      Log(saveF + 'save 🧡', {only: 'log'});
      await fs.writeFile(saveF, newdata);
      l.one(`翻译成功，位于：${saveF}`);
    }

    l.stop(); // two-log-min 的生命是 1.start 2. text 3.stop。不然 ora 就会 一直转
  } else {
    console.error('❌Error: input source Srt file path');
  }
})();
