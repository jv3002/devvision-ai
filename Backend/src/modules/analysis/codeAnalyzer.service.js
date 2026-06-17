import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;

export const analyzeProject = (repoPath) => {

  let lines = 0;
  let functions = 0;
  let files = 0;

  const extensions = [".js", ".ts", ".jsx", ".tsx"];

  const scanDirectory = (dir) => {

    const items = fs.readdirSync(dir);

    for (const item of items) {

      const fullPath = path.join(dir, item);

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {

        scanDirectory(fullPath);

      } else {

        const ext = path.extname(fullPath);

        if (extensions.includes(ext)) {

          files++;

          const code = fs.readFileSync(fullPath, "utf-8");

          lines += code.split("\n").length;

          try {

            const ast = parse(code, {
              sourceType: "module",
              plugins: ["jsx", "typescript"]
            });

            traverse(ast, {

              FunctionDeclaration() {
                functions++;
              },

              ArrowFunctionExpression() {
                functions++;
              },

              FunctionExpression() {
                functions++;
              },

              ClassMethod() {
                functions++;
              },

              ObjectMethod() {
                functions++;
              }

            });

          } catch (error) {

            console.log("Parse error:", fullPath);

          }

        }

      }

    }

  };

  scanDirectory(repoPath);

  return {
    lines_of_code: lines,
    functions,
    files
  };

};