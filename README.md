# 网测通 NetCheck CN

网测通是一个面向中文用户的免费网络检测工具网站，提供公网 IP 查询、IP 归属地查询、DNS 解析记录查询、公共 DNS 结果对比，以及 HTTP 请求耗时检测。

**正式地址：** https://netcheck-cn.github.io/  
**GitHub 仓库：** https://github.com/netcheck-cn/netcheck-cn.github.io

## 核心页面

| 页面 | 路径 | 作用 |
| --- | --- | --- |
| 首页 | `/` | 当前公网 IP、IPv4/IPv6 独立检测 |
| IP 查询 | `/ip-lookup/` | 指定 IP 地址归属地查询、特殊地址识别 |
| DNS 查询 | `/dns-lookup/` | DNS 记录查询与 Google/Cloudflare 解析结果对比 |
| HTTP 延迟 | `/latency-test/` | 浏览器 Fetch 请求耗时与失败统计（不是 Ping） |
| 网络知识 | `/guides/` | 实用的中文网络排查指南 |
| 隐私说明 | `/privacy/` | 第三方检测 API 和 Analytics 说明 |

## 无需编译的 GitHub Pages 部署步骤

1. 从网站 ZIP 解压出 **所有文件和文件夹**，不要直接把 ZIP 上传到仓库。
2. 打开 https://github.com/netcheck-cn/netcheck-cn.github.io 。
3. 上传根目录下的 `index.html`、`404.html`、`favicon.ico`、`.nojekyll`、`robots.txt`、`sitemap.xml`，以及完整 `assets/`、`ip-lookup/`、`dns-lookup/`、`latency-test/`、`guides/` 等目录。
4. 在仓库的 **Settings → Pages** 选择 **Deploy from a branch**、`main`、`/(root)`，保存。
5. 打开 https://netcheck-cn.github.io/ 。确认首页、DNS 和 IP 查询页的脚本及图片都能加载。

如果已有旧网站，需完整覆盖旧版对应文件；不要把新版压缩包放进单独子目录。

## 技术与依赖

- 原生 HTML / CSS / JavaScript，GitHub Pages 纯静态部署，不需要服务器和数据库。
- 依赖浏览器可访问的第三方 IP 和 DNS API。免费接口可能限流、不可达或变更服务条款。
- Google Analytics 4 衡量 ID：`G-D9GC3GMQH9`（以 Google 后台实际显示为准）。
- 虎跃加速器推广链接：https://huyuejsq.co/；广告区域明确标注广告，与检测结果独立。
- 不包含完整上传/下载带宽测速、系统级 ICMP Ping、真实 DNS 泄漏检测或完整路由追踪。

## 内容与目录

- `assets/css/style.css`：全站样式，包括响应式广告和移动端布局。
- `assets/js/app.js`：网络检测逻辑。
- `assets/images/`：网站 Logo、favicon、独立广告背景素材。
- `guides/`：四篇中文网络知识文章。
- `sitemap.xml` 和 `robots.txt`：公开抓取配置。
- `tests/logic.test.cjs`：部分 JavaScript 本地逻辑回归测试（开发者可使用 Node.js 执行，网站部署本身不需要 Node.js）。

## 上线前检查

- 实际浏览器验证 IPv4/IPv6、IP 归属地、Google 与 Cloudflare DNS 请求；确认错误状态有说明。
- 在手机和电脑浏览器检查 360px、390px、768px、1280px 下页面无横向溢出，广告文字完整可读。
- 检查 GA4 实时报告是否收到访问事件，检查浏览器标签页 icon。
- 检查全站链接、Canonical、Sitemap，必要时使用 PageSpeed Insights 测试在线性能。

此仓库的 IP 位置数据来自第三方数据库估计，不等于用户精确位置；HTTP 请求耗时不是标准 Ping，也不能直接代表下载带宽。

## 本轮改进说明

- 查询成功的 IP 归属地及 DNS 查询状态增加本地查询完成时间（仅帮助识别结果新旧，不等于数据更新时间）。
- 404 页面改为带常用工具入口的完整响应式页面，设置 `noindex,follow`，不展示推广广告。
- 增加静态站点预检脚本 `tests/site_audit.py`，使用 Python 标准库运行即可，不需要为网站部署配置 Python。
- 使用浏览器访问真实站点时仍需验证跨域 API、网络连通性、GA4 和移动端效果。
