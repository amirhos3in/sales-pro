import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function flag(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const port = process.env.PORT || flag("-p", "43123");
const host = process.env.HOSTNAME || flag("-H", "0.0.0.0");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const tsxBin = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");

const children = [
  spawn(process.execPath, [nextBin, "dev", "-H", host, "-p", String(port)], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  }),
  spawn(process.execPath, [tsxBin, path.join(root, "server", "platform.ts")], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, PLATFORM_PORT: process.env.PLATFORM_PORT || "43124" },
  }),
];

function stop() {
  for (const child of children) child.kill("SIGTERM");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children) {
  child.on("exit", (code) => {
    if (code) {
      stop();
      process.exit(code);
    }
  });
}
