# 网测通 NetCheck

**网测通**是一个免费的中文在线网络检测工具网站，提供公网 IP 查询、IP 归属地查询、DNS 解析检测和 HTTP 请求耗时检测。

无需安装软件，打开网页即可使用。

**网站地址：** https://netcheck-cn.github.io/

## 在线工具

### 我的公网 IP

https://netcheck-cn.github.io/

查看当前网络的公网出口 IP 地址，并检测 IPv4、IPv6 连接情况。

### IP 归属地查询

https://netcheck-cn.github.io/ip-lookup/

支持查询指定 IPv4、IPv6 地址的归属地及网络信息。

- **单个 IP 查询：** 查看国家、地区、城市、运营商或 ASN 等可用信息。
- **批量 IP 查询：** 一次查询最多 50 个 IP 地址，支持导出 CSV 文件。

IP 归属地来自第三方数据库，可能与设备实际位置不同。批量查询主要提供国家及 ASN 等基础信息，不提供精确城市定位。

### DNS 解析检测

https://netcheck-cn.github.io/dns-lookup/

查询域名的 DNS 记录，并对比 Google DNS 和 Cloudflare DNS 的解析结果。

支持常见的 A、AAAA、CNAME、MX、TXT、NS 和 SOA 记录查询。

不同 DNS 解析器返回的结果可能存在差异，不一定意味着域名或网络发生故障。

### HTTP 请求耗时检测

https://netcheck-cn.github.io/latency-test/

测量浏览器访问指定网络服务时的请求完成耗时。

支持选择测试目标及采样次数，查看平均耗时、中位数和请求波动情况。

本工具测量的是浏览器 HTTP Fetch 请求耗时，不等同于 ICMP Ping 或宽带下载速度测试。

## 网络知识

网站还提供常见网络问题的中文说明：

- [公网 IP 和内网 IP 的区别](https://netcheck-cn.github.io/guides/public-vs-private-ip/)
- [IP 归属地为什么不准确](https://netcheck-cn.github.io/guides/ip-location-accuracy/)
- [DNS 解析失败怎么办](https://netcheck-cn.github.io/guides/dns-troubleshooting/)
- [网络延迟和网速的区别](https://netcheck-cn.github.io/guides/latency-vs-speed/)

更多内容：[网络知识](https://netcheck-cn.github.io/guides/)

## 关于网测通

网测通希望让常用网络检测更简单，让用户能够快速获取查询结果，并理解这些结果的含义。

检测数据可能受到网络环境、浏览器限制、第三方服务及数据更新周期的影响。查询结果仅供网络诊断与参考。

- [关于我们](https://netcheck-cn.github.io/about/)
- [隐私政策](https://netcheck-cn.github.io/privacy/)
- [联系我们](https://netcheck-cn.github.io/contact/)

---

**网测通 NetCheck — 免费在线网络检测工具**

https://netcheck-cn.github.io/
