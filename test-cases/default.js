import { test } from "node:test";
import assert from "node:assert";

test("pass", () => {
  console.log("HERE");
  assert(true);
});

test("fail", () => {
  assert(false);
});
