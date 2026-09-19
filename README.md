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
├── trade-analysis.html# 交易回放分析（上传 TradingView 交易记录 CSV 自动分析）
└── README.md
```

> 说明：`index.html` 中还预留了一个「🧾 发票助手」入口（`./invoice.html`，发票抬头快速复制），该页面目前尚未创建，属待开发项。

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

### 📈 交易回放分析（trade-analysis.html）
- 上传 TradingView 导出的交易记录 CSV，**自动解析并去重**（每笔交易在导出中含「进场 + 出场」两行，净损益会被自动按交易编号合并，避免重复计算）
- 概览指标：交易笔数、总净损益、胜率、盈亏比、期望值、最大回撤、最大盈利/亏损、总手续费、最长连胜/连亏
- **权益曲线**：累计净损益折线图
- **盈亏分布**：每笔交易盈亏柱状图（红涨绿跌）
- **胜负占比**甜甜圈 + **多头/空头**表现对比
- **交易明细表**：方向、进出场时间/价格、数量、净损益、回报%、手续费、持仓 K 线数
- 兼容中文 / 英文表头；支持点击选择或拖拽上传；纯前端、无后端、数据不上传

## 技术栈

- 纯静态 HTML / CSS / JavaScript
- 首页通过 CDN 引入 [Vue 3](https://unpkg.com/vue@3) 与 [Tailwind CSS](https://cdn.tailwindcss.com)
- 计算器为原生 JS 实现，无第三方依赖
- 部署平台：[GitHub Pages](https://pages.github.com/)

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

- [ ] 补全 `invoice.html`「发票助手」页面（首页入口已预留）
- [ ] 增加更多工具卡片（如：时间戳转换、JSON 格式化、Base64 编解码等）
- [ ] 计算历史持久化（当前仅保存在内存，刷新即丢失）
