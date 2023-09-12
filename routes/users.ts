import { Express, NextFunction, Request, Response } from 'express';
const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto =  require('crypto');
import storage from '../models';
const UsersRouter: Express = express.Router()

UsersRouter.get('/stats', (req: Request, res: Response) => {
  res.send("User stats...")
})



UsersRouter.get('/play', (req: Request, res: Response) => {
  const reqCategories = req.query.categories as string
  const filters = {
    difficulty: req.query.difficulty as string,
    categories: reqCategories.split(",")
  }
  const questions = storage.filterQuestions(filters)
  res.json(questions)
})

export default UsersRouter
