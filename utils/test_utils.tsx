import { GlobalContext, IGlobalContext, initialGlobalContext } from "@/app/store";
import { CategoryStat, DifficultyStat, IUserStats } from "@/models/interfaces";
import User from "@/models/user";
import { render } from "@testing-library/react";
import { ReactElement } from "react";

const customRender = (
  ui: ReactElement,
  { providerProps, ...renderOptions }: { providerProps: IGlobalContext }
) => {
  return render(
    <GlobalContext.Provider value={providerProps}>{ui}</GlobalContext.Provider>,
    renderOptions
  );
};

export * from "@testing-library/react";
export { customRender as render };
export * from "@testing-library/user-event";


// setup context values
export const mockContext = initialGlobalContext;
mockContext.storageIsAvailable = true;

// create mock user
export const mockUser = new User("mock user");
mockContext.userStatus.isLoaded = true;
mockContext.userStatus.isOnline = true;
mockContext.userStatus.user = mockUser;

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
}
