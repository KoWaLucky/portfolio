# Carma Portfolio

## Форма → Telegram (без сторонних сервисов)

Форма отправляет сообщения напрямую в твой Telegram через твой же бот. Нет Formspree, FormSubmit и т.п.

### Как настроить

1. **Деплой на Vercel**
   - Зайди на [vercel.com](https://vercel.com) → Import Git Repository → выбери `KoWaLucky/portfolio`
   - Или: `vercel` в терминале из папки проекта

2. **Добавь переменные окружения** (Vercel → Project → Settings → Environment Variables):
   - `TELEGRAM_BOT_TOKEN` — токен от [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_CHAT_ID` — свой ID (можно узнать у [@userinfobot](https://t.me/userinfobot))

3. Готово. Форма на `твой-проект.vercel.app` будет отправлять сообщения в Telegram.

> На GitHub Pages форма не работает (там нет сервера). Нужен Vercel (бесплатно).

## Языки

RU | EN | DE | ES | PT | TH
