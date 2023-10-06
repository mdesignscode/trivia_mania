import '@testing-library/jest-dom';

// Mock process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...process.env,
    NEXT_PUBLIC_API_BASE_URL: "mockhost/api",
  };
});

afterAll(() => {
  process.env = originalEnv;
});
// Mock axios post request for testing
jest.mock("axios");
