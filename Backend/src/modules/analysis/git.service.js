import { exec } from "child_process";
import path from "path";

export const cloneRepository = async (repoUrl, projectId) => {

  const repoPath = path.resolve("repos", projectId);

  console.log("Cloning repository:", repoUrl);
  console.log("Repo path:", repoPath);

  return new Promise((resolve, reject) => {

    exec(`git clone ${repoUrl} ${repoPath}`, (error) => {
      if (error) {
        console.error("Git clone error:", error.message);
        return reject(error);
      }

      resolve(repoPath); // 🔥 ESTO ES CLAVE
    });

  });

};