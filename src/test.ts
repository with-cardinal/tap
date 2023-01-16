import { test } from "node:test";
import assert from "node:assert/strict";
import { ProcessResult, run } from "@withcardinal/ts-std";

function runTestCase(testCase: string): Promise<ProcessResult> {
  return run(
    `node --test test-cases/${testCase}.js | node ./dist/index.js`,
    false
  );
}

const summaryCases = [
  ["success", "1 passing"],
  ["fail", "1 failing, 0 passing"],
];

summaryCases.map(([testCase, expectedLastLine]) => {
  test(`summary - ${testCase}`, async () => {
    const result = await runTestCase(testCase as string);
    const lines = result.stdout.split("\n");
    const lastLine = lines[lines.length - 2] || "";

    assert(lastLine.startsWith(expectedLastLine as string));
  });
});
