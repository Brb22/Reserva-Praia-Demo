# 🏖️ Reserva Praia

App para gerenciamento de reservas de apartamento em Praia Grande - Vila Caiçara.

## 🔗 Demo ao vivo
👉 **[Acessar o app](https://reserva-praia.vercel.app)**

## 📱 Funcionalidades

- ✅ Login com autenticação de usuários
- 📅 Agenda de reservas com calendário interativo
- 🌡️ Temperatura em tempo real de Praia Grande (Open-Meteo API)
- ⛅ Previsão do clima no dia do check-in
- 🔒 Bloqueio automático de datas já reservadas
- 📊 Histórico de estadias concluídas
- 🗑️ Cancelamento de reservas
- 🔄 Atualização automática a cada 30 segundos
- 📲 Funciona como Web App no iPhone (PWA)

## 🛠️ Tecnologias

**Frontend**
- React Native + Expo
- Expo Router
- TypeScript
- Axios

**Backend**
- Node.js + Express
- MongoDB Atlas
- Mongoose

**Deploy**
- Frontend: Vercel
- Backend: Render

## 🚀 Como rodar localmente

```bash
# Backend
cd reserva-praia-backend
npm install
npm run dev

# Frontend
cd reserva-praia-frontend
npm install
npx expo start
```

## 👨‍💻 Desenvolvido por
Bruno Rocha Brito