/* eslint-disable @typescript-eslint/no-namespace */
import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      // Add other custom matchers here if needed
    }
  }
}
