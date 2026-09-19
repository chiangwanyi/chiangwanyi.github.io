# 项目记忆 · chiangwanyi.github.io

## 技术栈约定
- 纯静态 GitHub Pages 站点，**无构建步骤**。
- 所有页面统一使用 **Vue 3 (CDN: unpkg vue.global.prod.js) + Tailwind CSS (CDN: cdn.tailwindcss.com)**。
- 图标/图表用内联 SVG（无额外图表库依赖）；颜色用 CSS 变量 `--up`(红=盈利/涨) `--down`(绿=亏损/跌) `--blue`，遵循国内「红涨绿跌」。
- 隐私：交易分析页为纯前端，文件不上传。

## 页面清单
- index.html：工具导航首页（卡片入口）
- calculator.html：报销记账计算器（四则运算 + 人民币大写 + 历史）
- trade-analysis.html：TradingView 交易记录 CSV 分析（上传/拖拽、去重、权益曲线、盈亏分布、胜负甜甜圈、多空对比、明细表）
- README.md：项目说明
- invoice.html：首页有入口但文件尚未创建（待办）
