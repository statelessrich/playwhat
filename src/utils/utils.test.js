import { formatPlatforms } from "./utils";

// Describe the test and wrap it in a function.
it("formats list of platforms", () => {
  const result = formatPlatforms([
    { platform: { name: "ps4" } },
    { platform: { name: "switch" } },
    { platform: { name: "pc" } },
  ]);

  // Jest uses matchers, like pretty much any other JavaScript testing framework.
  // They're designed to be easy to get at a glance;
  // here, you're expecting `result` to be 2.5.
  expect(result).toBe("ps4|switch|pc");
});

xtest("should add", () => {
  expect(2).toBe(2);
});
