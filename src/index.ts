#!/usr/bin/env node

import { Parser } from "tap-parser";
import chalk from "chalk";

let pass = 0;
let fail = 0;
let duration: number | undefined = undefined;

function completeFn() {
  console.log();
  console.log();

  const summary: string[] = [];

  if (fail) {
    summary.push(chalk.red(`${fail} failing`));
  }

  summary.push(chalk.green(`${pass} passing`));

  if (duration) {
    summary.push(chalk.green(`${duration}ms`));
  }

  console.log(summary.join(", "));
}

type Result = {
  ok: boolean;
  name: string;
  diag?: { duration_ms?: number; error?: string; stack?: string };
  fullname?: string;
};

function resultFn(assert: Result) {
  if (assert.ok) {
    process.stdout.write(chalk.green("."));
    pass++;
  } else {
    console.log(chalk.red("x"));

    console.log();
    console.log(`${assert.name} - ${assert.fullname}`);
    console.log(`  Error: ${assert.diag?.error}`);
    console.log(`  at ${assert.diag?.stack?.split("\n").join("\n    ")}`);
    console.log();

    fail++;
  }
}

type RootAssert = {
  diag?: { duration_ms?: number };
};

function rootAssertFn(assert: RootAssert) {
  duration = assert.diag?.duration_ms;
}

const parser = new Parser(completeFn);

parser.on("result", resultFn);
parser.on("assert", rootAssertFn);

console.log();
process.stdin.pipe(parser);
