import { Express, NextFunction, Request, Response } from 'express';
import QuestionsRouter from './routes/questions';
import storage from './models';
import UsersRouter from 'routes/users';
const express = require('express')
const cors = require('cors');

storage.reload()
const app: Express = express();
const port = 3001;

app.use(cors({
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  path: '/**'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load storage into memory
function reloadStorage(req: Request, res: Response, next: NextFunction) {
  storage.reload()

  next();
}

app.use(reloadStorage)

app.get('/status', (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

app.use('/questions', QuestionsRouter)
app.use('/users', UsersRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
