# beauty-hub-prototype

## Run locally (no Docker)

1. Start the backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Open http://localhost:5173
