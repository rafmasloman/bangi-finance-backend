import dotenv from 'dotenv';
import express, { Express } from 'express';

import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import routes from './src/config/routes.config';

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1', routes);

const server = http.createServer(app);

server.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log('server is running on port : ', process.env.PORT);
});
