import { Express, Request, Response } from 'express';
const express = require('express')
import storage from '../models';
const QuestionsRouter: Express = express.Router()

QuestionsRouter.get('/stats', (req: Request, res: Response) => {
  res.json(storage.questionsStats())
})

export default QuestionsRouter
