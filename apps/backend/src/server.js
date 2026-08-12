// apps/backend/src/server.js
// Entry point — starts the Express server.

const app = require('./app');
const env = require('./config/env');

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   AOBNAP Backend Server                              ║
║   Afaan Oromo Business Name Approval Portal          ║
║──────────────────────────────────────────────────────║
║   Environment:  ${env.NODE_ENV.padEnd(36)}║
║   Port:         ${String(PORT).padEnd(36)}║
║   API Base:     http://localhost:${String(PORT).padEnd(22)}║
║   Health:       http://localhost:${PORT}/api/health${' '.repeat(Math.max(0, 15 - String(PORT).length))}║
╚══════════════════════════════════════════════════════╝
  `);
});
