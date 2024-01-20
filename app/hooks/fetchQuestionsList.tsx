/* Performs questions fetching */
"use client";
import { GlobalContext } from "@/app/context/globalContext";
import { IPlayRequest } from "@/models/customRequests";
import { IQuestion } from "@/models/interfaces";
import Question from "@/models/question";
import {
  CATEGORIES,
  CURRENT_INDEX,
  DIFFICULTY,
  NEW_PARAMS,
  POOL_INDEX,
  QUESTIONS_LIST,
  QUESTIONS_POOL,
  QUESTION_ANSWERED,
  clearQuestionData,
} from "@/utils/localStorage_utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

interface IFetchQuestions {
  questions: IQuestion[];
  nextQuestionsSet: () => void;
  questionsLength: number;
  questionIndex: number;
  incrementIndex: () => void;
  questionsPoolReady: boolean;
  poolIndex: number;
  setQuestionsPool: (state: IQuestion[]) => void;
}

export default function useFetchQuestionsList(): IFetchQuestions {
  const [_questionIndex, _setQuestionIndex] = useState(1);
  const questionIndex = useRef(_questionIndex);
  function setQuestionIndex(state: number) {
    questionIndex.current = state;
    _setQuestionIndex(state);
  }
  const [_questionsPoolReady, _setQuestionsPoolReady] = useState(false);
  const [localStorageReady, setLocalStorageReady] = useState(false);
  const questionsPoolReady = useRef(_questionsPoolReady);
  function setQuestionsPoolReady(state: boolean) {
    questionsPoolReady.current = state;
    _setQuestionsPoolReady(state);
  }

  // render 5 questions at a time
  const [_questionsPool, _setQuestionsPool] = useState<IQuestion[]>([]);
  const questionsPool = useRef(_questionsPool);
  function setQuestionsPool(state: IQuestion[]) {
    questionsPool.current = state;
    _setQuestionsPool(state);
  }
  const [_poolIndex, _setPoolIndex] = useState(0);
  const poolIndex = useRef(_poolIndex);
  const setPoolIndex = useCallback((index: number) => {
    poolIndex.current = index;
    _setPoolIndex(index);
  }, []);
  const [questionsLength, setQuestionsLength] = useState(0);

  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false);
  const [fetchQuestions, setFetchQuestions] = useState(true);

  const {
    triviaUser,
    playFilters: { difficulty, categories },
    storageIsAvailable,
    setNewFilters,
    newFilters,
  } = useContext(GlobalContext);

  // query function
  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}questions/play`;

    const { data } = await axios.post(url, {
      difficulty,
      categories: categories.split(",").filter(Boolean),
      userId: triviaUser?.id,
    } as IPlayRequest);

    const questions = shuffleArray(data);

    return questions;
  }

  // fetch list of questions
  const { data, isFetched } = useQuery({
    queryKey: ["play", triviaUser, difficulty, categories],
    queryFn: getQuestions,
    initialData: [],
    enabled: shouldFetchQuestions,
  });

  // create return object
  const fetchingUtils: IFetchQuestions = {
    questions: questionsPool.current,
    questionsLength,
    nextQuestionsSet,
    questionIndex: questionIndex.current,
    incrementIndex,
    questionsPoolReady: questionsPoolReady.current,
    poolIndex: poolIndex.current,
    setQuestionsPool,
  };

  // create initial questions pool
  const createQuestionPool = useCallback(() => {
    if (localStorageReady) {
      const localQuestionsPool = localStorage.getItem(QUESTIONS_POOL),
        localQuestionsList: Question[] = JSON.parse(
          localStorage.getItem(QUESTIONS_LIST) || "[]"
        ),
        localIndex = parseInt(localStorage.getItem(CURRENT_INDEX) || "1"),
        localPoolIndex = parseInt(localStorage.getItem(POOL_INDEX) || "0");

      if (localQuestionsPool) {
        setQuestionsPool(JSON.parse(localQuestionsPool));
        setPoolIndex(localPoolIndex);
      } else {
        const newIndex = calculateNewIndex(0, localQuestionsList.length),
          newPool = localQuestionsList.slice(0, newIndex);

        setQuestionsPool(newPool);
        localStorage.setItem(QUESTIONS_POOL, JSON.stringify(newPool));
      }

      localStorage.setItem(CURRENT_INDEX, questionIndex.current.toString());
      localStorage.setItem(POOL_INDEX, localPoolIndex.toString());

      setQuestionsLength(localQuestionsList.length);
      setQuestionIndex(localIndex);
      setLocalStorageReady(false);
      setQuestionsPoolReady(true);
    }
  }, [localStorageReady, setPoolIndex]);

  // fetch questions from api and store in local storage
  const fetchNewQuestions = useCallback(() => {
    if (fetchQuestions) {
      if (newFilters) {
        setShouldFetchQuestions(true);
        if (isFetched) {
          localStorage.setItem(QUESTIONS_LIST, JSON.stringify(data));
          localStorage.setItem(CATEGORIES, categories);
          localStorage.setItem(DIFFICULTY, difficulty);
          setLocalStorageReady(true);
          setFetchQuestions(false);
          setNewFilters(false);
        }
      } else {
        setLocalStorageReady(true);
        setFetchQuestions(false);
      }
    }
  }, [categories, data, difficulty, fetchQuestions, isFetched, newFilters, setNewFilters]);

  // set questions pool
  useEffect(() => {
    if (storageIsAvailable) {
      fetchNewQuestions();
      createQuestionPool();
    } else {
      if (fetchQuestions) {
        setShouldFetchQuestions(true);
        if (isFetched) {
          setQuestionsLength(data.length);
          setQuestionsPool(data.slice(0, 5));
          setFetchQuestions(false);
        }
      }
    }
  }, [
    createQuestionPool,
    data,
    fetchNewQuestions,
    fetchQuestions,
    isFetched,
    storageIsAvailable,
  ]);

  // fetch next set of questions from list
  function nextQuestionsSet() {
    setQuestionsPoolReady(false);

    const newIndex = calculateNewIndex(poolIndex.current, questionsLength);
    setPoolIndex(newIndex);

    const endIndex = calculateEndIndex(newIndex, questionsLength);

    if (storageIsAvailable) {
      // get questions list local storage
      const localQuestionsList = JSON.parse(
        localStorage.getItem(QUESTIONS_LIST) || "[]"
      ) as IQuestion[];

      incrementIndex();

      const newPool = localQuestionsList.slice(newIndex, endIndex);

      // set next set of questions
      setQuestionsPool(newPool);

      // increment pool index in memory and locally
      localStorage.setItem(POOL_INDEX, newIndex.toString());
      localStorage.setItem(QUESTIONS_POOL, JSON.stringify(newPool));
    } else {
      incrementIndex();
      setQuestionsPool((data as IQuestion[]).slice(newIndex, endIndex));
    }
    setQuestionsPoolReady(true);
  }

  function incrementIndex() {
    setQuestionIndex(questionIndex.current + 1);

    if (storageIsAvailable) {
      localStorage.setItem(QUESTION_ANSWERED, "false");
      localStorage.setItem(CURRENT_INDEX, questionIndex.current.toString());
    }
  }

  return fetchingUtils;
}

// shuffle questions
function shuffleArray(array: Array<IQuestion>): Array<IQuestion> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function calculateNewIndex(poolIndex: number, questionsLength: number) {
  return poolIndex + 5 > questionsLength
    ? questionsLength - poolIndex + poolIndex // last set of questions
    : poolIndex + 5;
}

export function calculateEndIndex(newIndex: number, questionsLength: number) {
  return newIndex + 5 > questionsLength ? questionsLength : newIndex + 5;
}
