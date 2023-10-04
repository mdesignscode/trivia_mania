/* Performs questions fetching */
"use client";
import { IQuestion } from "@/models/interfaces";
import { useQuery } from "@tanstack/react-query";
import { GlobalContext } from "app/store";
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
}

export default function useFetchQuestionsList(
  difficulty: string,
  categories: string[]
): IFetchQuestions {
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
  const [questionsPool, setQuestionsPool] = useState<IQuestion[]>([]);
  const [_poolIndex, _setPoolIndex] = useState(0);
  const poolIndex = useRef(_poolIndex);
  function setPoolIndex(index: number) {
    poolIndex.current = index;
    _setPoolIndex(index);
  }
  const [questionsLength, setQuestionsLength] = useState(0);

  const { storageIsAvailable } = useContext(GlobalContext);

  /* Fetch questions from api if previous filters don't match new filters
  Else use questions in local storage */
  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false);

  // query function
  async function getQuestions() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}questions/play`;

    const { data } = await axios.post(url, { difficulty, categories });

    return data;
  }

  // fetch list of questions
  const { data, isFetched } = useQuery({
    queryKey: ["play"],
    queryFn: getQuestions,
    initialData: [],
    enabled: shouldFetchQuestions,
  });

  // create return object
  const fetchingUtils: IFetchQuestions = {
    questions: questionsPool,
    questionsLength,
    nextQuestionsSet,
    questionIndex: questionIndex.current,
    incrementIndex,
    questionsPoolReady: questionsPoolReady.current,
    poolIndex: poolIndex.current,
  };

  // fetch questions from api and store in local storage if given new params
  const fetchNewQuestions = useCallback(() => {
    // get previous params
    const prevDiff = localStorage.getItem("difficulty") || "";
    const prevCategories = localStorage.getItem("categories") || "";
    const prevQuestions = localStorage.getItem("questionsList") || "[]";

    // check if previous params match new params
    const parsedQuestions = JSON.parse(prevQuestions) as string[];

    if (
      prevCategories === categories.join(",") &&
      prevDiff === difficulty &&
      !!parsedQuestions.length
    ) {
      // storage has questions
      setLocalStorageReady(true);
      return;
    }

    /// fetch questions and store in local storage
    setShouldFetchQuestions(true);
    if (isFetched) {
      localStorage.setItem("questionsList", JSON.stringify(data));

      // update search filters
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("categories", categories.join(","));

      // reset pool index
      setPoolIndex(0);
      localStorage.setItem("poolIndex", "0");
      localStorage.setItem("currentIndex", "1");
      // delete previous pool
      localStorage.removeItem("questionsPool");
      setQuestionsLength(data.length);

      // has not answered any quesions yet
      localStorage.setItem("questionAnswered", "false")
      localStorage.removeItem("answeredQuestions");
      localStorage.removeItem("progress")
      localStorage.removeItem("lastAnswer");
      localStorage.removeItem("lastAnswerIndex");

      // storage is now ready
      setLocalStorageReady(true);
    }
  }, [isFetched]);

  // fetch next set of questions from list
  function nextQuestionsSet() {
    setQuestionsPoolReady(false);
    const newIndex =
      poolIndex.current + 5 > questionsLength
        ? questionsLength - poolIndex.current + poolIndex.current // last set of questions
        : poolIndex.current + 5;
    if (storageIsAvailable) {
      // get questions list local storage
      const localQuestionsList = JSON.parse(
        localStorage.getItem("questionsList") as string
      ) as IQuestion[];

      incrementIndex();

      const endIndex =
        newIndex + 5 > questionsLength ? questionsLength : newIndex + 5;

      const newPool = localQuestionsList.slice(newIndex, endIndex);

      // set next set of questions
      setQuestionsPool(newPool);

      // increment pool index in memory and locally
      setPoolIndex(newIndex);
      localStorage.setItem("poolIndex", newIndex.toString());
      localStorage.setItem("questionsPool", JSON.stringify(newPool));
      localStorage.setItem("currentIndex", questionIndex.current.toString());
    } else {
      incrementIndex();
      setQuestionsPool(
        (data as IQuestion[]).slice(poolIndex.current, newIndex)
      );
    }
    setQuestionsPoolReady(true);
  }

  function incrementIndex() {
    setQuestionIndex(questionIndex.current + 1);

    if (storageIsAvailable) {
      localStorage.setItem("questionAnswered", "false")
      localStorage.setItem("currentIndex", questionIndex.current.toString());
    }
  }

  // set questions pool
  useEffect(() => {
    if (storageIsAvailable) {
      // use local storage as pool

      // first check if local storage has questions
      fetchNewQuestions();

      // then create pool
      if (localStorageReady) {
        /* create initial questions pool */

        // get questions list and previous pool from local storage
        const localQuestionsList = JSON.parse(
          localStorage.getItem("questionsList") as string
        ) as IQuestion[];
        const localQuestionsPool = localStorage.getItem("questionsPool");

        // get rendering starting indices
        const localPoolIndex = parseInt(
          localStorage.getItem("poolIndex") || "0"
        );
        const localIndex = parseInt(
          localStorage.getItem("currentIndex") || "1"
        );

        // use pool in local storage
        if (localQuestionsPool) {
          setQuestionsPool(JSON.parse(localQuestionsPool));
          setPoolIndex(localPoolIndex);
          localStorage.setItem("poolIndex", localPoolIndex.toString());
        } else {
          // set initial questions pool
          const index =
            localQuestionsList.length < 5
              ? localQuestionsList.length // last set of questions
              : 5;

          const initialPool = localQuestionsList.slice(0, index);
          setQuestionsPool(initialPool);

          // increment pool index in memory and locally
          localStorage.setItem("questionsPool", JSON.stringify(initialPool));
          localStorage.setItem("poolIndex", "0");
          localStorage.setItem("currentIndex", "1");
        }
        setQuestionIndex(localIndex);

        setQuestionsLength(localQuestionsList.length);

        setQuestionsPoolReady(true);
      }
    } else {
      // use memory as pool
      setShouldFetchQuestions(true);
      if (isFetched) {
        const newIndex =
          questionsLength < 5
            ? questionsLength - poolIndex.current + poolIndex.current // last set of questions
            : poolIndex.current + 5;
        setQuestionsPool((data as IQuestion[]).slice(0, newIndex));
        setPoolIndex(newIndex);
        setQuestionsPoolReady(true);
        setQuestionsLength(data.length);
      }
    }
  }, [storageIsAvailable, isFetched, localStorageReady]);

  return fetchingUtils;
}
