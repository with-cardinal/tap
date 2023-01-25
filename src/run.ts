import { spawn } from "child_process";

export type ProcessResult = {
  stdout: string;
  stderr: string;
  combined: string;
  code: number | null;
};

export async function run(
  command: string,
  print = true
): Promise<ProcessResult> {
  const result = {
    stdout: "",
    stderr: "",
    combined: "",
    code: 0,
  } as ProcessResult;

  return new Promise((resolve, reject) => {
    const proc = spawn(command, [], {
      shell: true,
      stdio: ["inherit", "pipe", "pipe"],
    });

    proc.on("close", (code) => {
      result.code = code;
      resolve(result);
    });

    proc.on("error", (err) => {
      reject(err);
    });

    proc.stdout.on("data", (data) => {
      if (print) {
        process.stdout.write(data);
      }
      result.stdout += data;
      result.combined += data;
    });

    proc.stderr.on("data", (data) => {
      if (print) {
        process.stderr.write(data);
      }
      result.stderr += data;
      result.combined += data;
    });
  });
}
