# 发布前离线功能测试

在本目录运行 `node tests/logic.test.cjs`。测试覆盖 DNS Answer 比较：顺序/TTL 不同、数据不同、DNS 状态码不同、Authority 字段不同，以及 IPv4/IPv6 地址判断等。

这些是无网络逻辑测试；不能代替真实浏览器和公网 API 验收。
