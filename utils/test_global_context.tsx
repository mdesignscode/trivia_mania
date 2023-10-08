import { GlobalContext, IGlobalContext, initialGlobalContext } from "@/app/store";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import User from "@/models/user";
import { render } from "./test_utils";
import { ReactElement } from "react";

// setup context values
export const mockGlobalContext = JSON.parse(
  JSON.stringify(initialGlobalContext)
) as IGlobalContext
mockGlobalContext.storageIsAvailable = true;

// create mock user
export const mockUser = new User("mock user");
mockGlobalContext.userStatus.isLoaded = true;
mockGlobalContext.userStatus.isOnline = true;
mockGlobalContext.userStatus.user = mockUser;

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

export const renderGlobalContext = (ui: ReactElement) => {
  return render(
    <GlobalContext.Provider value={mockGlobalContext}>
      {ui}
    </GlobalContext.Provider>
  );
};
