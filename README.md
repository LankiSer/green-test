# MAX Web Chat (GREEN-API)

Тестовое задание: упрощённый веб-мессенджер на **React** с отправкой и приёмом текстовых сообщений через [GREEN-API MAX](https://green-api.com/max).

## Возможности

- Вход по `apiUrl`, `idInstance`, `apiTokenInstance`
- Новый чат по номеру телефона
- Отправка текста (`SendMessage`)
- Приём входящих сообщений через HTTP API (`ReceiveNotification` + `DeleteNotification`)
- Интерфейс в духе [web.max.ru](https://web.max.ru/) (тёмная тема, список чатов, пузыри)

## Требования

- Node.js 20+
- Авторизованный инстанс GREEN-API (QR в личном кабинете)
- Для приёма по HTTP: **пустой** `webhookUrl` и включённые входящие уведомления в настройках инстанса

## Запуск локально

```bash
npm install
cp .env.example .env.local   # заполните credentials
npm run dev
```

Откройте http://localhost:5173

В режиме разработки запросы к API проксируются через Vite (`/green-api` → ваш `apiUrl`), чтобы обойти CORS.

## Сборка

```bash
npm run build
npm run preview
```

Для production задайте `VITE_GREEN_*` при сборке или вводите данные на экране входа.

## Стек

- React 19, TypeScript, Vite
- React Router
- Tailwind CSS 4

## Структура

- `src/common/auth` — учётные данные инстанса
- `src/common/messaging` — клиент GREEN-API, polling, хранение чатов
- `src/pages` — login и messenger

## API

- [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- [HTTP API receiving](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
