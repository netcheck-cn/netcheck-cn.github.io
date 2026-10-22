# 网测通本地质量复核

- JavaScript: `node --check` 通过。
- 本地 JavaScript 逻辑测试：IPv4、IPv6、特殊用途地址、域名校验及 DNS 状态，均通过。
- HTML、站内链接、Canonical 与 Sitemap：本地静态检查完成。
- 广告素材：桌面/手机 WebP 资源均存在。

## 尚未验证

未完成公网 IP/DNS 服务的真实跨网络请求验收、浏览器手机和桌面截图验收、实际广告点击，以及 Lighthouse / Core Web Vitals 测量。上述项目不得标记通过。

## 本轮修复

- 增加 `2001:db8::/32` 文档专用 IPv6 地址提示、IPv4 映射 IPv6 地址提示。
- DNS API 顶层类型验证和 Answer 中异常项目过滤，避免异常数据导致整个结果区渲染失败。
- DNS 复制文本统一从 DOM 文本内容读取。

## 本次验收问题修正
- DNS 状态对比限制为 Answer 记录，明确 Authority/Additional 不参与比较；添加独立规范化函数。
- HTTP 延迟表述改成 Fetch 请求结束耗时，明确无法读取 HTTP 状态，也不证明目标站正常。
- `tests/logic.test.cjs` 可重复验证 DNS 正常/差异/错误状态，以及地址分类。
- 真实公网请求、跨设备浏览器和 CWV 仍**未验证**。
