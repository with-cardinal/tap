#!/usr/bin/env node

import { Parser } from "tap-parser";
import chalk from "chalk";
import parseArgs from "minimist";
import { writeMarkdown } from "./markdown.js";

let pass = 0;
let fail = 0;
let duration: number | undefined = undefined;
let md = false;
const results: Result[] = [];

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

  if (md) {
    writeMarkdown(pass, fail, duration, results);
  }
}

export type Result = {
  ok: boolean;
  name: string;
  diag?: { duration_ms?: number; error?: string; stack?: string };
  fullname?: string;
};

function resultFn(assert: Result) {
  if (md) {
    results.push(assert);
  }

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

function main() {
  const argv = parseArgs(process.argv.slice(2));

  if (argv["help"]) {
    console.log();
    console.log("tap - Cardinal's Test Anything Protocol Reporter");
    console.log();
    console.log("Options:");
    console.log("  --help\tPrint this message");
    console.log("  --md\t\tWrite markdown output to test-results.md");
    return;
  }

  if (argv["md"]) {
    md = true;
  }

  const parser = new Parser(completeFn);

  parser.on("result", resultFn);
  parser.on("assert", rootAssertFn);

  console.log();
  process.stdin.pipe(parser);
}

main();
