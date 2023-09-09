import { Express, NextFunction, Request, Response } from 'express';
const express = require('express')
import storage from '../models';
const QuestionsRouter: Express = express.Router()

QuestionsRouter.get('/stats', (req: Request, res: Response) => {
  const stats = storage.questionsStats(req.query.difficulty as string)
  res.json(stats)
})

QuestionsRouter.get('/play', (req: Request, res: Response) => {
  const reqCategories = req.query.categories as string
  const filters = {
    difficulty: req.query.difficulty as string,
    categories: reqCategories.split(",")
  }
  const questions = storage.filterQuestions(filters)
  res.json(questions)
})

export default QuestionsRouter
