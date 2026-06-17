import fs from "fs";
import parser from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;

class JavaScriptAdapter {
  parseFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");

    const ast = parser.parse(content, {
      sourceType: "unambiguous",
      plugins: ["jsx", "classProperties"],
      errorRecovery: true,
      ranges: false,
      tokens: false
    });

    return {
      imports: this.extractImports(ast),
      functions: this.extractFunctions(ast),
      lines: content.split("\n").length
    };
  }

  extractImports(ast) {
    const imports = [];

    traverse(ast, {
      ImportDeclaration(path) {
        imports.push(path.node.source.value);
      },
      CallExpression(path) {
        if (
          path.node.callee &&
          path.node.callee.name === "require" &&
          path.node.arguments.length > 0
        ) {
          imports.push(path.node.arguments[0].value);
        }
      }
    });

    return imports;
  }

  extractFunctions(ast) {
    const functions = [];

    traverse(ast, {
      FunctionDeclaration(path) {
        if (path.node.loc) {
          const loc = path.node.loc;
          const size = loc.end.line - loc.start.line;
          functions.push(size);
        }
      },
      ArrowFunctionExpression(path) {
        if (path.node.loc) {
          const loc = path.node.loc;
          const size = loc.end.line - loc.start.line;
          functions.push(size);
        }
      }
    });

    return functions;
  }
}

export default new JavaScriptAdapter();