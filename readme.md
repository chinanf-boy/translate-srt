## translate-srt [![translate-svg]][translate-list]

[translate-svg]: http://llever.com/translate.svg
[translate-list]: https://github.com/chinanf-boy/chinese-translate-list

`srt`(字幕格式文件)-(英文转)中文翻译工具

```bash
transalte-srt [srt file-path]
```

## npm ![npm](https://img.shields.io/npm/v/translate-srt.svg?style=for-the-badge)

```
npm i -g translate-srt
```

## Tips

### 重翻译

```bash
translate-srt [srt file-path] -R
```

### 多 srt 文件

是的，本工具只对单一文件负责

- `files.sh`

```bash
find *.srt | while read line
do
    echo "$line"
    translate-srt "$line"
done
```

### 其他字幕格式

如`ass`...之类的其他字幕格式，抱歉。

给个提示，就是使用转换工具，如，强而伟大的`ffmpeg`，进行转换(`ass`=>`srt`)

```
ffmpeg -i source.ass source.srt
```

> 其实，针对 srt 格式的解析，本工具只是做了[两正则式的匹配](./tranSrt.js#L7)。或许真有人提议，我们就把对应格式的正则式放在一个文件模块中，如`{'srt':[第一个正则式,第一个正则式],'ass':[...], '*': ...}`之类的

### 调试

```bash
transalte-srt [srt file-path] -D
```

## 相关

- [translate-mds](https://github.com/chinanf-boy/translate-mds) 翻译 `md` 文件
- [two-log-min](https://github.com/chinanf-boy/two-log-min) ora + debug ，仅仅供给个人使用。

## 题外话

测试并不是很多，但主要功能也只有一个，[test.zh.srt](./test.zh.srt) 就是由 `translate-srt` + [test.srt](./test.srt)，而来。

实践例子：

- `LiveOverflow @ youtube 「Binary Hacking / Memory Corruption （让我们 he 二进制吧）」视频` ：[youtube](https://www.youtube.com/watch?v=iyAyN3GFM7A&list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN) (已由该工具翻译，只是校对未完成，也许会上传到 B 站，毕竟我也要看，时间不定)

> 本来在 2018.6 月 有人上传了第一集中文字幕，说好再更的，啧！一点动静都没有。
