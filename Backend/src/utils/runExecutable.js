import { exec } from "child_process";
import path from "path";

export default function runExecutable(patron, cadenas) {
  return new Promise((resolve, reject) => {

    const exePath = path.join(process.cwd(), "exe", "KMP.exe");

    // Formato EXACTO que tu .exe necesita:
    // patron|cadena1|cadena2|cadena3...
    const argumento = `${patron}|${cadenas.join("|")}`;

    const comando = `"${exePath}" "${argumento}"`;

    exec(comando, (error, stdout, stderr) => {
      if (error) {
        console.error("Error ejecutando KMP.exe:", error);
        return reject(error);
      }

      resolve(stdout.trim());
    });
  });
}
