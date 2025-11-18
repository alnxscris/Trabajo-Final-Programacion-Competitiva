import { execFile } from "child_process";
import path from "path";

export default function runExecutable(patron, cadenas) {
  return new Promise((resolve, reject) => {
    const exePath = path.join(process.cwd(), "exe", "KMP.exe");

    const args = [patron, ...cadenas];

    execFile(exePath, args, (error, stdout) => {
      if (error) {
        console.error("Error ejecutando KMP.exe:", error);
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}
