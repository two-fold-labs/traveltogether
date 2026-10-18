import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.warn(`Server running on port ${String(env.port)}`);
});
