import Body from "@/components/body";
import { renderGlobalContext } from "@/utils/test_global_context";
import { screen } from "@/utils/test_utils";

describe("Body component", () => {
  it("Renders an introduction animation", async () => {
    const { baseElement } = renderGlobalContext(<Body>Mock child</Body>, {
      pageReady: false,
    });

    const container = await screen.findByTestId("intro-animation-container");
    expect(container).toBeInTheDocument();

    const introText = ["Trivia Mania", "by", "Marlon Baatjes"];

    for (let i = 0; i < introText.length; i++) {
      const word = introText[i];

      for (let j = 0; j < word.length; j++) {
        const letter = word[j]
        if (letter === " ") continue;
        const allMatchers = await screen.findAllByTestId(`${letter}_${j}`);
        for (const matcher of allMatchers) {
          expect(matcher).toBeInTheDocument();
        }
      }
    }

    expect(baseElement).toMatchSnapshot();
  });

  it("Renders <Navigation /> and current page content", async () => {
    const { baseElement } = renderGlobalContext(<Body>Mock child</Body>);

    const container = await screen.findByTestId("desktop-nav-container"),
      text = await screen.findByText("Mock child");

    expect(container).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });
});
