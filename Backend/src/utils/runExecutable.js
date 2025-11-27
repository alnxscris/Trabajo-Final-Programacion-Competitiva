import { execFile } from "child_process";
import path from "path";

export function ejecutarKMP(patron, cadena) {
  return new Promise((resolve, reject) => {
    const exePath = path.join(process.cwd(), "exe", "KMP.exe");

    const args = [patron, cadena];

    execFile(exePath, args, (error, stdout) => {
      if (error) {
        console.error("Error ejecutando KMP.exe:", error);
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}