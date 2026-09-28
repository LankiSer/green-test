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

## Деплой на [Railway](https://railway.app)

1. Залейте репозиторий на **GitHub** (без `.env.local` и токенов в git).
2. Railway → **New Project** → **Deploy from GitHub repo** → выберите репозиторий.
3. В **Variables** добавьте:
   - `GREEN_API_TARGET_URL` = `https://3100.api.green-api.com` (ваш `apiUrl` из кабинета)
   - опционально для автозаполнения login (только если осознанно):  
     `VITE_GREEN_API_URL`, `VITE_GREEN_ID_INSTANCE`, `VITE_GREEN_API_TOKEN` — **нужны на этапе build**; проще вводить credentials на экране входа после деплоя.
4. **Settings → Networking → Generate Domain** — получите публичный URL.
5. Build: `npm ci && npm run build`, Start: `npm start` (уже в `railway.toml`).

На Railway запросы к GREEN-API идут через прокси `/green-api` на `GREEN_API_TARGET_URL` (без CORS в браузере).

**Важно:** `apiUrl` на экране входа должен совпадать с тем же хостом, что и `GREEN_API_TARGET_URL` на сервере.

## Стек

React 19, TypeScript, Vite, React Router, Tailwind CSS 4, Express (static + proxy).

## API

- [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- [HTTP API receiving](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
- [GetChats](https://green-api.com/v3/docs/api/service/GetChats/)
