import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import { IQuestion } from "@/models/interfaces";

type TStat = Record<string, number>

export const mockInitialProgress: IUserStats = {
  total: {
    correctAnswered: 1,
    answered: 1,
  },
  easy: {
    answered: 1,
    correctAnswered: 1,
  } as DifficultyStat,
  Science: {
    easy: {
      answered: 1,
      correctAnswered: 1,
    } as DifficultyStat,
  } as CategoryStat,
};

// create mock questions
export const mockQuestions: Record<string, IQuestion> = {
  "63805aab-b589-4256-9493-769eecc23966": {
    "category": "Entertainment: Film",
    "answers": [
      "Batman v Superman: Superapocalypse",
      "Batman v Superman: Black of Knight",
      "Batman v Superman: Dawn of Justice",
      "Batman v Superman: Knightfall"
    ],
    "correctAnswer": "Batman v Superman: Dawn of Justice",
    "id": "63805aab-b589-4256-9493-769eecc23966",
    "question": "Which movie released in 2016 features Superman and Batman fighting?",
    "difficulty": "medium"
  },
  "36240604-80aa-4ddb-bb87-5ce345bfd379": {
    "category": "Entertainment: Film",
    "answers": ["R2-D2", "AA-A", "BB-8", "BB-3"],
    "correctAnswer": "BB-8",
    "id": "36240604-80aa-4ddb-bb87-5ce345bfd379",
    "question": "What is the orange and white bot&#039;s name in &quot;Star Wars: The Force Awakens&quot;?",
    "difficulty": "easy"
  },
  "12c4b40f-7fa9-405d-81de-b64c54a0caea": {
    "category": "Entertainment: Music",
    "answers": [
      "James Blunt - &quot;1973&quot;",
      "Prince - &quot;1999&quot;",
      "The Smashing Pumpkins - &quot;1979&quot;",
      "David Bowie - &quot;1984&quot;"
    ],
    "correctAnswer": "The Smashing Pumpkins - &quot;1979&quot;",
    "id": "12c4b40f-7fa9-405d-81de-b64c54a0caea",
    "question": "Which of these songs was released in 1996?",
    "difficulty": "hard"
  },
  "b2d0c4b4-ac68-491c-a561-60848ea34fb6": {
    "category": "Entertainment: Music",
    "answers": [
      "Gimmie! Gimmie! Gimme! (A Man After Midnight)",
      "Night Fever",
      "The Chain",
      "Staying Alive"
    ],
    "correctAnswer": "Gimmie! Gimmie! Gimme! (A Man After Midnight)",
    "id": "b2d0c4b4-ac68-491c-a561-60848ea34fb6",
    "question": "Madonna&#039;s song &quot;Hung Up&quot; includes a piece from which popular 70s song?",
    "difficulty": "medium"
  },
  "83cea789-1c6d-4757-a571-c79a14a9133f": {
    "category": "General Knowledge",
    "answers": ["Liver", "Skin", "Heart", "large Intestine"],
    "correctAnswer": "Skin",
    "id": "83cea789-1c6d-4757-a571-c79a14a9133f",
    "question": "What is the largest organ of the human body?",
    "difficulty": "easy"
  },
  "c051d919-2618-4f4d-bb42-5e13bdf58423": {
    "category": "General Knowledge",
    "answers": ["Vanilla", "Saffron", "Cinnamon", "Cardamom"],
    "correctAnswer": "Saffron",
    "id": "c051d919-2618-4f4d-bb42-5e13bdf58423",
    "question": "What is the world&#039;s most expensive spice by weight?",
    "difficulty": "medium"
  },
  "9289f1e9-f0c7-4fe4-a4f9-755745eb0bc8": {
    "category": "Entertainment: Video Games",
    "answers": ["Diamond/Pearl", "Ruby/Sapphire", "X/Y", "Black/White"],
    "correctAnswer": "Diamond/Pearl",
    "id": "9289f1e9-f0c7-4fe4-a4f9-755745eb0bc8",
    "question": "Which Pokemon generation did the fan-named &quot;Masuda Method&quot; first appear in? ",
    "difficulty": "easy"
  },
  "4db885c9-d4c1-4515-9e20-db71d6557cd6": {
    "category": "Entertainment: Video Games",
    "answers": [
      "Tateyuki Shigaraki",
      "Manfred Von Karma",
      "Gregory Edgeworth",
      "Bansai Ichiyanagi"
    ],
    "correctAnswer": "Bansai Ichiyanagi",
    "id": "4db885c9-d4c1-4515-9e20-db71d6557cd6",
    "question": "In the &quot;Ace Attorney&quot; series, who was the truly responsible of the forging of the autopsy report of the pivotal IS-7 incident?",
    "difficulty": "hard"
  },
}

// mock questions stats
export const mockDifficultyStats: TStat = {
  medium: 3,
  hard: 2,
  easy: 3,
  "all difficulties": 8
}

// mock category stats for different difficulties
export const mockCategoryStats: TStat = {
  "Entertainment: Film": 2,
  "Entertainment: Video Games": 2,
  "General Knowledge": 2,
  "Entertainment: Music": 2,
  "all categories": 8
}

export const mockEasyStats: TStat = {
  "Entertainment: Film": 1,
  "Entertainment: Video Games": 1,
  "General Knowledge": 1,
  "all categories": 3
}

export const mockHardStats: TStat = {
  "Entertainment: Music": 1,
  "Entertainment: Video Games": 1,
  "all categories": 2
}

export const mockMediumStats: TStat = {
  "Entertainment: Film": 1,
  "General Knowledge": 1,
  "Entertainment: Music": 1,
  "all categories": 3
}

// mock question
export const mockQuestion: IQuestion = {
  question: "Mock &lt;Question&gt;",
  id: "mockId",
  difficulty: "easy",
  correctAnswer: "Mock Correct Answer",
  category: "Mock Category",
  answers: [
    "Mocha &amp; Chai",
    "React &#124; Vue &#124; Angular",
    "Mock Aswer 3",
    "Mock Correct Answer",
  ],
};
