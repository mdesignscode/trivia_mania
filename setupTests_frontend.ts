import '@testing-library/jest-dom';

// mock windowWidth hook to return false, desktop screen size
export const isMobileRef = { current: false }
jest.mock("@/hooks/windowWidth", () => () => isMobileRef.current)

// clear localStorage
beforeEach(() => {
  localStorage.clear();
});

// Mock process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...process.env,
    testEnv: "true",
    NEXT_PUBLIC_API_BASE_URL: "mockhost/api",
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Mock axios post request for testing
jest.mock("axios");
