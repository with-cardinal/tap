import { test } from "node:test";
import assert from "node:assert";

test("pass", () => {
  assert(true);
});

test("fail", () => {
  assert(false);
});
