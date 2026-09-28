# MAX Web Chat (GREEN-API)

Тестовое задание: упрощённый веб-мессенджер на **React** с отправкой и приёмом текстовых сообщений через [GREEN-API MAX](https://green-api.com/max).

## Возможности

- Вход по `apiUrl`, `idInstance`, `apiTokenInstance`
- Синхронизация чатов и истории (`GetChats`, журналы, `GetChatHistory`)
- Новый чат по номеру телефона
- Отправка текста (`SendMessage`)
- Приём входящих в реальном времени (`ReceiveNotification` + `DeleteNotification`)
- UI в духе [web.max.ru](https://web.max.ru/)

## Требования

- Node.js 20+
- Авторизованный инстанс GREEN-API (QR в личном кабинете)
- Для приёма по HTTP: **пустой** `webhookUrl` и включённые входящие уведомления

## Запуск локально

```bash
npm install
cp .env.example .env.local   # опционально: автозаполнение формы входа
npm run dev
```

http://localhost:5173 — API проксируется через Vite (`/green-api`).

## Production (локально)

```bash
npm run build
npm start
```

http://localhost:4173

## Бесплатный деплой (рекомендуем: Render)

Подходит любой хостинг с **Node.js** и командой `npm start` (у нас Express + статика + прокси API).

### [Render.com](https://render.com) — самый простой заменитель Railway

1. Репозиторий на **GitHub** (без `.env.local`).
2. Render → **New** → **Blueprint** → подключите repo (есть `render.yaml`)  
   **или** **Web Service** вручную:
   - Build: `npm ci && npm run build`
   - Start: `npm start`
   - Instance type: **Free**
3. **Environment** → `GREEN_API_TARGET_URL` = `https://3100.api.green-api.com`
4. После деплоя URL вида `https://green-max-chat.onrender.com`

**Минус free tier:** сервис «засыпает» без посещений (~50 с на первый запрос после паузы).

### Другие бесплатные варианты

| Платформа | Плюсы | Минусы |
|-----------|--------|--------|
| [Fly.io](https://fly.io) | Не спит так агрессивно | Нужен CLI / `fly launch`, лимиты по RAM |
| [Koyeb](https://www.koyeb.com) | GitHub deploy, Docker | Free tier с лимитами |
| [Glitch](https://glitch.com) | Очень просто | Слабее для постоянного polling API |
| [Vercel](https://vercel.com) / [Netlify](https://netlify.com) | Отлично для статики | Прокси GREEN-API нужно отдельно (serverless); наш `server.mjs` — проще на Render |

**Не подойдут без доработки:** чистый GitHub Pages / Cloudflare Pages (только статика, без Node-прокси → CORS к GREEN-API).

### Railway

Аналогично Render: `GREEN_API_TARGET_URL`, build `npm ci && npm run build`, start `npm start` (`railway.toml`).

---

На хостинге запросы идут через `/green-api` → `GREEN_API_TARGET_URL`.  
**Важно:** `apiUrl` на экране входа = тот же хост, что в `GREEN_API_TARGET_URL`.

## Стек

React 19, TypeScript, Vite, React Router, Tailwind CSS 4, Express (static + proxy).

## API

- [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- [HTTP API receiving](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
- [GetChats](https://green-api.com/v3/docs/api/service/GetChats/)
