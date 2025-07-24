# Chess Game

A modern chess game built with React, TypeScript, Tailwind CSS, and Vite.

### Features
- Full movement rules for all pieces
- Special moves: castling, en passant, promotion
- Legal move validation (no self-check)
- **Black player is controlled by Stockfish AI**
- Responsive board UI with clean styling

### Tested Logic
All movement and rule logic is unit-tested with Vitest.

### Demo
[Play it on GitHub Pages](https://sengiria.github.io/chess/)

### Tech Stack
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [Stockfish](https://stockfishchess.org/) (via Node backend)

---

### Setup

```bash
npm install
npm run dev
```

### Architecture

- Frontend: This repository (React + Vite)
- Backend (AI Server):  
  → **[Chess AI Backend Repo](https://github.com/Sengiria?tab=repositories)**  
  Runs a local instance of **Stockfish** to calculate best moves for the black side.

> The frontend communicates with the backend via HTTP to fetch the best move when it's Black's turn.

---
