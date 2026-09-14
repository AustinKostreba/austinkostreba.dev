import { expect, test } from "@playwright/test";

test("paper-backed image crops are not used during canvas loading", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".stone-art-layer img")).toHaveCount(0);
});

test("rings render, move subtly, and respect reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const rings = page.locator(".stone-ring");
  await expect(rings).toHaveCount(5);
  await expect(page.locator(".background-ember")).toHaveCount(36);
  await expect(rings.first().locator("canvas").first()).toHaveCSS(
    "opacity",
    "1",
  );
  const before = await rings
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(500);
  await expect
    .poll(() => rings.first().evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before);
  const bounds = await rings.first().boundingBox();
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.65,
    bounds!.y + bounds!.height * 0.5,
  );
  await page.waitForTimeout(500);
  expect(
    await rings
      .first()
      .evaluate((el) =>
        Number.parseFloat(
          (el as HTMLElement).style.getPropertyValue("--pointer-heat"),
        ),
      ),
  ).toBeGreaterThan(0);
  const transforms = await rings.evaluateAll((elements) =>
    elements.map((el) => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return { x: matrix.m41, y: matrix.m42 };
    }),
  );
  for (const transform of transforms) {
    expect(Math.abs(transform.x)).toBeLessThanOrEqual(19);
    expect(Math.abs(transform.y)).toBeLessThanOrEqual(21);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const ring of await rings.all())
    await expect(ring).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => rings.first().evaluate((el) => getComputedStyle(el).transform))
    .not.toBe("none");
  expect(errors).toEqual([]);
});

test("copy, fonts, mobile layout and keyboard access", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".role")).toHaveText(
    "Software engineering manager at Renaissance.",
  );
  await expect(page.locator("h1")).toHaveCSS(
    "font-family",
    /Libre Baskerville/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  const intro = await page.locator(".introduction").boundingBox();
  const art = await page.locator(".stone-artwork").boundingBox();
  expect(art!.y).toBeGreaterThan(intro!.y + intro!.height);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("switch")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toBeFocused();
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});

test("day and night states switch copy, theme, and destination", async ({
  page,
}) => {
  await page.goto("/");
  const shift = page.getByRole("switch");
  await expect(shift).toHaveAttribute("aria-checked", "false");
  await expect(page.locator("html")).toHaveAttribute("data-shift", "day");
  await shift.click();
  await expect(shift).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("html")).toHaveAttribute("data-shift", "night");
  await expect(page.locator(".role")).toHaveText(
    "Paid-on-call firefighter at West Metro Fire-Rescue District.",
  );
  await expect(page.locator(".current-work")).toContainText(
    "On nights and weekends, I respond to emergencies",
  );
  await expect(
    page.getByRole("link", { name: /West Metro Fire-Rescue/ }),
  ).toHaveAttribute("href", "https://www.wmfrd.org/");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(23, 21, 28)",
  );
  await expect(page.locator(".history")).toHaveCount(0);
  await expect(page.locator(".ember-art").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".ember-field")).toHaveCSS("opacity", "1");
  await shift.click();
  await shift.click();
  await expect(shift).toHaveAttribute("aria-checked", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await shift.click();
  await expect(page.locator("html")).toHaveAttribute("data-shift", "day");
});
