import { exec } from "child_process";

// Use concurrently via direct shell command
const command = `npx concurrently -k -n BACKEND,FRONTEND,ADMIN -c green,cyan,magenta "npm run dev -w backend" "npm run dev -w frontend" "npm run dev -w admin"`;

const proc = exec(command);

proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);

proc.on("exit", (code) => {
  console.log(`\n❌ One of the processes exited with code ${code}`);
});
