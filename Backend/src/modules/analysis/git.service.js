import { execFile } from "child_process";
import fs from "fs";
import path from "path";

export const cloneRepository = async (repoUrl, projectId) => {
  if (!repoUrl || typeof repoUrl !== "string") {
    throw new Error("Repository URL is required");
  }

  if (!repoUrl.startsWith("https://github.com/")) {
    throw new Error("Only public GitHub repositories are allowed");
  }

  const reposDir = path.resolve("repos");

  if (!fs.existsSync(reposDir)) {
    fs.mkdirSync(reposDir, { recursive: true });
  }

  const repoPath = path.resolve(reposDir, projectId);

  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  console.log("Cloning repository:", repoUrl);
  console.log("Repo path:", repoPath);

  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["clone", "--depth", "1", repoUrl, repoPath],
      {
        timeout: 60000
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Git clone error:", stderr || error.message);
          return reject(new Error("Repository clone failed"));
        }

        console.log(stdout);
        resolve(repoPath);
      }
    );
  });
};