# ZELOOS (TCC)

- `frontend/` — React + Vite + TypeScript. `npm run dev` (porta 5173), `npm run build`, `npm run lint`.
- `backend/` — Node + Express 5 + TypeScript + mysql2. Copie `.env.example` para `.env`. `npm run dev` (porta 3333, rotas em `/api`), `npm run typecheck`, `npm run build`.
- `backend/database/zeloos.sql` — schema MySQL/MariaDB (usado via HeidiSQL). Recria o banco `zeloos` do zero.
- MariaDB 12.3 está instalado em `C:\Program Files\MariaDB 12.3`. Para testes, use uma instância temporária (`mariadb-install-db --datadir=... --port=3399`) em vez do banco do usuário.
