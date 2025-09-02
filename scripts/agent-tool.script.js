import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths relative to project root
const projectRoot = path.resolve(__dirname, "..");
const toolsDir = path.join(
  projectRoot,
  "convex",
  "infrastructure/components/agents/restaurants",
  "tools",
);
const barrelFile = path.join(toolsDir, "index.ts");

function generateBarrelFile() {
  try {
    console.log("🔍 Scanning tools directory for changes...");
    const files = fs.readdirSync(toolsDir);
    const toolFiles = files.filter((file) => file.endsWith(".tool.ts")).sort();

    if (toolFiles.length === 0) {
      console.log(
        "⚠️  No restaurant agent tool files found in tools directory",
      );
      return;
    }

    const exports = toolFiles.map((file) => {
      const moduleName = file.replace(".ts", "");
      return `export * from "./${moduleName}";`;
    });

    const content = exports.join("\n") + "\n";

    // Read current barrel file content to check if update is needed
    let currentContent = "";
    if (fs.existsSync(barrelFile)) {
      currentContent = fs.readFileSync(barrelFile, "utf8");
    }

    // Only write if content has changed
    if (currentContent !== content) {
      fs.writeFileSync(barrelFile, content, "utf8");
      console.log("✅ Updated barrel file with the following exports:");
      console.log();
      toolFiles.forEach((file) => console.log(`🛠️  ${file}`));
      console.log();
      console.log(
        `🛠️ Generated ${toolFiles.length} export${
          toolFiles.length === 1 ? "" : "s"
        } in index.ts`,
      );
    } else {
      console.log("✨ Barrel file is already up to date");
    }
  } catch (error) {
    console.error("❌ Error generating barrel file:", error.message);
    process.exit(1);
  }
}

function main() {
  console.log("🚀 Restaurant agent tool script started");
  console.log(`📂 Watching: ${toolsDir}`);
  console.log(`📝 Barrel target: ${barrelFile}`);
  console.log("─".repeat(50));

  generateBarrelFile();
}

main();
