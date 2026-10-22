# 网测通：GitHub Pages 上传指南

正式地址：https://netcheck-cn.github.io/
所属组织：netcheck-cn
仓库：netcheck-cn.github.io

## 上传步骤

1. 下载 ZIP 并**解压**，不要直接上传 ZIP 文件。
2. 打开 https://github.com/netcheck-cn/netcheck-cn.github.io 。
3. 在仓库 Code 页点击 **Add file → Upload files**，上传**解压后的内容**，保持文件夹结构（不要多套一层 network-tools-site 目录）。GitHub 网页拖放上传文件夹的实际支持情况受浏览器影响；若无法保持目录结构，推荐用 GitHub Desktop 或分目录逐一上传。
4. 保持仓库为 Public。在 **Settings → Pages** 中选择 **Deploy from a branch** → `main` → `/(root)`，保存。
5. 等待部署完成，然后访问 https://netcheck-cn.github.io/ 。首次发布可能需要数分钟。
6. 分别试用首页 IP、IP 归属地、DNS 查询、HTTP 延迟四个页面，在自己使用的网络环境下检查第三方接口。

## 已绑定的 SEO 地址

所有内容页已有绝对 canonical；sitemap.xml 和 robots.txt 已绑定 https://netcheck-cn.github.io/ 。如将来更换站点域名，须同步替换这三处信息。

## 技术与维护边界

- 只需要静态托管，不需要 Node、PHP、服务器或数据库。
- IP 查询、DNS 查询依赖第三方免费接口，存在访问、限额与政策变更风险。
- HTTP 延迟使用 Google 测试端点的浏览器 fetch 耗时，仅供辅助诊断，不是 Ping 或网速测试。
- 无法在本环境替代国内外真实用户设备和网络的在线验收。
- 广告为可替换的原创 SVG 横幅，并非虎跃官方品牌授权素材。
- 联系页尚无公开邮箱，等待站主提供真正可用的联系方式。

## V3 新增功能线上测试

- 首页与 IP 查询页分别测试 IPv4 / IPv6 按钮。若其中一个失败，确认网络是否可连接对应协议；失败不等于一定不支持。
- DNS 页面尝试 A、AAAA、MX 等独立查询与「六类记录一键概览」。
- 检查接口超时、无记录、无效域名、IPv6 长地址的显示。

## V4.0 更新
上传新版时请覆盖同名文件，不能仅上传 zip。可访问 https://netcheck-cn.github.io/dns-lookup/ 核对 DNS 提示是否出现。


广告素材使用 `assets/images/huyue-ad-desktop.webp` 与 `huyue-ad-mobile-bg.webp`，两套适配共用广告链接。请上传替换全站文件，不要留下原版广告 SVG。
