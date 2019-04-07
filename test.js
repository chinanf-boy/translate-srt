const assert = require('assert');
const {exec} = require('child_process');

const cli1 = 'node tranSrt.js test.zh.srt';
console.log('test1', cli1);
exec(cli1, (error, stdout, stderr) => {
  assert(error == null);
  assert(stderr.includes('✔ 翻译文件'));

  console.log('test1 pass 😊 ');
});

const cli2 = 'node tranSrt.js test.srt';
console.log('test2', cli2);
exec(cli2, (error, stdout, stderr) => {
  assert(error == null);
  assert(stderr.includes('✔ 已翻译'));

  console.log('test2 pass 😊 ');
});

const cli3 = 'node tranSrt.js';
console.log('test3', cli3);
exec(cli3, (error, stdout, stderr) => {
  assert(error);
  assert(stderr.includes('input source Srt file path'));

  console.log('test3 pass 😊 ');
});
