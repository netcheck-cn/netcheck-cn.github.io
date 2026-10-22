# 网测通（NetCheck CN）

网测通是面向中文用户的免费网络检测工具站，提供公网 IP 查看、IP 地址归属地查询、DNS 解析查询和 HTTP 请求耗时观测。

- 网站：https://netcheck-cn.github.io/
- 仓库：https://github.com/netcheck-cn/netcheck-cn.github.io

## 主要功能

| 功能 | 页面 | 说明 |
| --- | --- | --- |
| 我的公网 IP | [首页](https://netcheck-cn.github.io/) | 查看当前公网出口 IP，独立检测 IPv4 / IPv6 |
| IP 归属地与批量查询 | [IP 查询](https://netcheck-cn.github.io/ip-lookup/) | 单个 IP 使用 IPwho.is；批量最多 50 个 IP，使用 IPinfo Lite，可导出 CSV |
| DNS 查询 | [DNS 查询](https://netcheck-cn.github.io/dns-lookup/) | 使用 Google、Cloudflare 的 DNS-over-HTTPS 查询和对照记录 |
| HTTP 请求耗时 | [延迟检测](https://netcheck-cn.github.io/latency-test/) | 观测 Google 或 Cloudflare 端点的浏览器 Fetch 完成耗时，可取 5/10 次样本；并非 ICMP Ping 或带宽测速 |
| 网络知识 | [指南](https://netcheck-cn.github.io/guides/) | 公网与内网 IP、IP 定位偏差、DNS 故障和延迟知识 |

结果依赖第三方 API、当地网络连通性和浏览器策略；IP 归属地属于数据库估计，不能代表用户精确位置。批量 IPinfo Lite 数据主要是国家级信息及 ASN，不提供省份和城市。

## GitHub Pages 部署

本项目是原生 HTML / CSS / JavaScript 静态站点，不需要服务器、数据库、付费接口或编译。

1. 解压发布 ZIP，将解压出来的 **根目录内容** 上传到仓库 `netcheck-cn/netcheck-cn.github.io` 的 `main` 分支根目录。不要把 ZIP 文件或外层文件夹直接上传。
2. 覆盖同名的 `index.html`、页面目录、`assets/`、`robots.txt` 和 `sitemap.xml` 等文件。
3. GitHub 仓库 `Settings → Pages` 使用 `Deploy from a branch`，选择 `main`、`/(root)`。
4. 发布后检查首页、IP 查询、DNS 查询、延迟检测和移动端显示。

注意：通过 GitHub 网页上传文件 **不会自动删除仓库已有的多余文件**。`tests/` 可以保留作为项目测试资源；若要清理历史报告，请在仓库中单独核对后删除。

## IPinfo Lite 批量查询配置

浏览器端配置位于 `assets/js/ipinfo-config.js`。批量模式需要 IPinfo Lite API Token；请使用自己账户签发的有效 Token。因为网站是公开的纯静态页面，**前端 Token 会对访客可见**，不能将它当作保密凭证。建议只使用免费 Lite 访问权限、定期检查账户用量与安全设置，必要时轮换 Token。

IPwho.is 与 IPinfo Lite 的字段精度不同，界面会分别说明。第三方接口的可用性、访问限制和服务条款可能变化。

## 目录说明

- `index.html`、`404.html`：首页和错误页。
- `ip-lookup/`、`dns-lookup/`、`latency-test/`：工具页面。
- `guides/`：网络知识文章。
- `about/`、`privacy/`、`contact/`：站点信息页面。
- `assets/css/style.css`：样式。
- `assets/js/app.js`：工具运行逻辑。
- `assets/js/ipinfo-config.js`：IPinfo Lite 浏览器配置。
- `assets/images/`：网站图标、Logo 与横幅图像。
- `.nojekyll`、`robots.txt`、`sitemap.xml`：GitHub Pages 与搜索引擎配置。

## 使用说明

本站检测结果仅供网络排查参考，不提供 ICMP Ping、下载/上传带宽测速、精确地理定位或系统级 DNS 泄漏检测。站点包含明确标注的推广广告，检测结果与广告独立。

更多第三方数据请求说明见 [隐私说明](https://netcheck-cn.github.io/privacy/)。
