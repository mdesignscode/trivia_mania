import { create } from "zustand";

interface GameState {
  questions: TQuestion[];
  setQuestions: (questions: TQuestion[]) => void;
  startPlaying: boolean;
  setStartPlaying: (state: boolean) => void;
}

const useGameStore = create<GameState>()((set) => ({
  questions: [],
  setQuestions: (questions) => set(() => ({ questions })),
  startPlaying: false,
  setStartPlaying: (state) => set(() => ({ startPlaying: state })),
}));

export default useGameStore;
