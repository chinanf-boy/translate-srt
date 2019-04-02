## translate-srt

`srt`-(英文转)中文翻译工具

```bash
transalte=srt [srt file-path]
```

## Tips

### 多文件，翻译

- `files.sh`

```bash
find *.srt | while read line
do
    echo "$line"
    translate-srt "$line"
done
```
