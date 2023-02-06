import { test, expect } from "@playwright/test";

test("homepage has a button on it", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const button = page.getByRole("button", {
    name: /Sign in/i,
  });

  await expect(button).toBeVisible();
});
