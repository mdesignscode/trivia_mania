import {
  HomeContext,
  HomeProvider,
  IHomeContext,
} from "@/app/context/homeContext";
import { GameContext, GameProvider, IGameContext } from "@/context/gameContext";
import {
  GlobalContext,
  GlobalProvider,
  IGlobalContext,
} from "@/context/globalContext";
import RenderType from "@testing-library/dom/types/queries";
import { ReactNode } from "react";
import { RenderResult, render } from "./test_utils";
import { renderGlobalContext } from "./test_global_context";
import { mockCategoriesStats } from "./test_home_context";
import { mockDifficultyStats } from "./mockData";

export function renderProvider(
  provider: "game"
): (
  children: (value: IGameContext) => ReactNode
) => RenderResult<typeof RenderType, HTMLElement, HTMLElement>;

export function renderProvider(
  provider: "global"
): (
  children: (value: IGlobalContext) => ReactNode
) => RenderResult<typeof RenderType, HTMLElement, HTMLElement>;

export function renderProvider(
  provider: "home"
): (
  children: (value: IHomeContext) => ReactNode
) => RenderResult<typeof RenderType, HTMLElement, HTMLElement>;

export function renderProvider(provider: string) {
  switch (provider) {
    case "game":
      return (children: (value: IGameContext) => ReactNode) =>
        renderGlobalContext(
          <GameProvider>
            <GameContext.Consumer>{children}</GameContext.Consumer>
          </GameProvider>
        );

    case "home":
      return (children: (value: IHomeContext) => ReactNode) =>
        renderGlobalContext(
          <HomeProvider
            categoryStats={mockCategoriesStats}
            difficultyStats={mockDifficultyStats}
          >
            <HomeContext.Consumer>{children}</HomeContext.Consumer>
          </HomeProvider>
        );

    default:
      return (children: (value: IGlobalContext) => ReactNode) =>
        render(
          <GlobalProvider>
            <GlobalContext.Consumer>{children}</GlobalContext.Consumer>
          </GlobalProvider>
        );
  }
}
