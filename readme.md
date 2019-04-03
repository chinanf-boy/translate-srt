## translate-srt

`srt`(字幕格式文件)-(英文转)中文翻译工具

```bash
transalte-srt [srt file-path]
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
