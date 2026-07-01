/**
 * local server entry file, for local development
 */
import app from './app.js';
import type { AddressInfo } from 'node:net';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  const address = server.address() as AddressInfo | null;
  console.log(`Server ready on port ${address?.port ?? PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the existing process or set a different PORT before starting the API server.`,
    );
    process.exit(1);
  }

  console.error('Server failed to start:', error);
  process.exit(1);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
