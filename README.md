# 家长沟通Agent MVP 1.0

帮助初中家长在面对孩子成绩下降、沉迷手机、叛逆顶嘴、考前焦虑、不写作业等问题时，生成具体沟通话术和 7 天行动方案。

## 功能

- 首页高频问题入口
- 咨询表单：孩子年级、问题类型、问题描述、希望语气
- AI 生成固定结构结果：问题判断、家长误区、推荐话术、7 天行动建议、复盘提醒
- 高风险关键词提示
- 复制结果、保存到历史、重新咨询
- 历史记录使用浏览器 localStorage 保存

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```bash
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4o-mini
```

3. 启动开发服务

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## API

`POST /api/generate`

请求体：

```json
{
  "grade": "初一",
  "issueType": "孩子沉迷手机",
  "description": "最近一回家就刷短视频，说两句就顶嘴。",
  "tone": "温和"
}
```

服务端会调用 OpenAI API，并返回前端可直接渲染的结构化 JSON。

## 风险关键词

当用户输入包含以下词语时，结果页会显示明显风险提示：

自杀、自残、想死、家暴、虐待、打死、离家出走、精神崩溃
