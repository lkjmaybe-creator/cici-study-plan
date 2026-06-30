# CiCi 暑假成长打卡：部署和同步说明

## 当前状态

这个 App 仍然可以直接在本机运行。新增了可选云同步：

- 不填云同步配置：数据保存在当前设备浏览器里。
- 填好 Supabase 配置：电脑、iPad、手机可以同步同一份数据。

## 一、创建 Supabase 数据库

1. 打开 https://supabase.com
2. 注册或登录账号。
3. 创建一个新项目。
4. 进入项目后，打开左侧 SQL Editor。
5. 复制 `supabase-schema.sql` 里的全部内容，粘贴进去运行。
6. 打开 Project Settings -> API。
7. 复制：
   - Project URL
   - anon public key

## 二、在 App 里填写同步配置

1. 打开 CiCi App。
2. 点击“家长中心”。
3. 找到“云同步设置”。
4. 填入：
   - Supabase URL
   - Supabase anon key
   - 家庭同步码，例如 `cici-family-2026`
5. 点击“保存同步设置”。

每台设备都填同一组配置和同一个家庭同步码，就会同步同一份数据。

## 三、发布成别人也能打开的网址

推荐用 GitHub Pages、Vercel、Netlify 或 Cloudflare Pages。

这个项目是纯静态网页，发布时只需要上传这些文件：

- `index.html`
- `styles.css`
- `app.js`
- `assets/`

发布后，用 iPad、手机、电脑打开同一个网址，再填同样的云同步配置即可。

## 四、重要提醒

当前云同步是家庭自用 MVP。`anon key` 是公开前端 key，不是密码。

为了简单易用，数据库策略允许匿名读写这张表。请使用一个不容易猜到的家庭同步码，例如：

`cici-family-2026-zhejiang-star`

后续如果要更安全，可以再升级成家长登录版本。
