# 在线工具集合

一个托管在 GitHub Pages 上的纯静态「实用工具导航」站点。无需后端、无需构建，所有页面均为静态 HTML，打开即用。

## 体验地址

部署后访问：`https://<你的用户名>.github.io/`

（将 `<你的用户名>` 替换为你的 GitHub 账号名。若仓库名为 `chiangwanyi.github.io`，则地址即为 `https://chiangwanyi.github.io/`）

## 项目结构

```
.
├── index.html         # 首页：在线工具集合导航（卡片式入口）
├── calculator.html    # 报销记账计算器（四则运算 + 人民币大写 + 历史记录）
├── clash-verge.html   # Clash Verge 全局扩展脚本生成器（优选 IP → vless+ws 节点）
└── README.md
```

## 功能一览

### 🛠️ 首页（index.html）
- 基于 Vue 3 + Tailwind CSS（CDN 引入）的卡片式导航页
- 「点击卡片进入对应工具」的入口聚合页

### 🔢 报销记账计算器（calculator.html）
- 简易四则运算（加、减、乘、除、小数点）
- 实时显示计算表达式与结果
- **人民币大写**：结果自动转换为「壹贰叁…元角分」中文大写金额（财务报销友好）
- **计算历史**：保存最近 20 条记录，点击可恢复输入
- 键盘支持：数字 / 运算符直接输入，`Enter` 或 `=` 计算结果，`Backspace` 删除，`C` 清空
- 浮点数处理：结果四舍五入到 2 位小数，规避 `0.1 + 0.2` 类精度问题

### 🧩 Clash Verge 全局扩展脚本生成器（clash-verge.html）
- 填写节点域名（Host）、UUID、WS 路径、端口等基础参数
- **快捷录入**：把 CloudflareST 的测试结果整段粘贴进来，自动解析 IP / 下载速度 / 地区码
- 解析时可设置：这批 IP 的宽带标识（电信 / 移动 / 联通）、最低下载速度阈值、跳过速度为 0、跳过已存在的 IP
- **优选 IP 列表**：按速度降序插入，每行可单独编辑 IP / 宽带 / 备注 / 速度，可增删行、清空
- 生成 **Clash Verge 全局扩展脚本**：为每个 IP 输出一个 `vless + ws + tls` 节点，自动去重注入到 `proxies`，并把它们追加进名称含「节点选择」的代理组
- 附带自定义规则注入示例（`lucidtrading.com` 直连），并先去重同域规则再前置
- 节点名格式：`【优选·电信】202610291430 DEN 57.92 MB/s`（时间戳取生成时刻）
- 一键复制（含非 HTTPS 环境降级方案），纯前端、数据不上传

## 技术栈

- 纯静态 HTML / CSS / JavaScript
- Vue 3 与 Tailwind CSS **全部本地化**（`assets/` 目录），不依赖任何外部 CDN，国内访问无跨境请求、可离线使用
  - `assets/vue.global.prod.js`：Vue 3.5.44 生产版（取自 npmmirror）
  - `assets/tailwind.css`：用 Tailwind CLI 3.4.17 预编译并按现有页面裁剪后的静态样式（约 12 KB，替代原来的浏览器端 JIT 版 `cdn.tailwindcss.com`，省掉 ~400 KB 脚本和运行时编译）
- 计算器与脚本生成器为原生 JS / Vue 实现，均无第三方依赖
- 部署平台：[GitHub Pages](https://pages.github.com/)

### 改样式后如何重新生成 assets/tailwind.css

新增/修改 HTML 里的 Tailwind 类名后，需要重新编译一次（只需一次，产物提交进仓库）：

```bash
npx tailwindcss@3.4.17 -i /dev/stdin -o assets/tailwind.css --content "./*.html" --minify
# 输入内容为三行：@tailwind base; @tailwind components; @tailwind utilities;
```

或用临时 input.css：

```bash
printf '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' > /tmp/in.css
npx tailwindcss@3.4.17 -i /tmp/in.css -o assets/tailwind.css --content "./*.html" --minify
```

## 本地预览

由于是纯静态站点，任选一种方式即可：

**方式一：直接打开**
双击 `index.html` 用浏览器打开即可。

**方式二：本地起一个静态服务器**（推荐，避免个别浏览器对本地文件的限制）

```bash
# Python（任意版本均可）
python -m http.server 8000
# 然后访问 http://localhost:8000
```

```bash
# 或使用 Node
npx serve .
```

## 部署（GitHub Pages）

1. 将本仓库推送到 GitHub
2. 进入仓库 **Settings → Pages**
3. Source 选择 **Deploy from a branch**，Branch 选择 `main`（或你的默认分支），目录选 `/ (root)`
4. 保存后等待几分钟，即可得到访问地址

## 待办 / 可扩展

- [ ] 增加更多工具卡片（如：时间戳转换、JSON 格式化、Base64 编解码等）
- [ ] 计算历史持久化（当前仅保存在内存，刷新即丢失）
