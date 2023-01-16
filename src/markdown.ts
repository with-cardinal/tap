import type { Result } from ".";
import fs from "fs";
import path from "path";

export function writeMarkdown(
  pass: number,
  fail: number,
  duration: number | undefined,
  results: Result[]
) {
  const content: string[] = [];

  const summary: string[] = [];

  if (fail) {
    summary.push(`${fail} failing`);
  }

  summary.push(`${pass} passing`);

  if (duration) {
    summary.push(`${duration}ms`);
  }

  content.push(summary.join(", "));

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    content.push("");
    content.push("## Failures");
  }

  failed.map((assert) => {
    content.push("\n");
    content.push(`### ${assert.name} - \`${assert.fullname}\``);
    content.push("\n");
    content.push(`\`${assert.diag?.error}\``);
    content.push("\n");
    content.push("```");
    content.push(`  at ${assert.diag?.stack?.split("\n").join("\n    ")}`);
    content.push("```");
    content.push("\n");
  });

  fs.writeFileSync(
    path.join(process.cwd(), "test-results.md"),
    content.join("\n")
  );
}
