#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths relative to project root
const projectRoot = path.resolve(__dirname, "..");
const schemasDir = path.join(projectRoot, "convex", "schemas");
const barrelFile = path.join(schemasDir, "index.ts");

/**
 * Generates barrel file exports for all schema files in the schemas directory
 * Scans for .schema.ts files and creates export statements
 */
function generateBarrelFile() {
  try {
    console.log("🔍 Scanning schemas directory for changes...");

    // Read all files in schemas directory
    const files = fs.readdirSync(schemasDir);

    // Filter for schema files (exclude index.ts and non-schema files)
    const schemaFiles = files
      .filter((file) => file.endsWith(".schema.ts"))
      .sort(); // Sort alphabetically for consistent output

    if (schemaFiles.length === 0) {
      console.log("⚠️  No schema files found in schemas directory");
      return;
    }

    // Generate export statements
    const exports = schemaFiles.map((file) => {
      const moduleName = file.replace(".ts", "");
      return `export * from "./${moduleName}";`;
    });

    // Add final newline for clean formatting
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
      schemaFiles.forEach((file) => console.log(`   📄 ${file}`));
      console.log(
        `📁 Generated ${schemaFiles.length} export${
          schemaFiles.length === 1 ? "" : "s"
        } in index.ts`
      );
    } else {
      console.log("✨ Barrel file is already up to date");
    }
  } catch (error) {
    console.error("❌ Error generating barrel file:", error.message);
    process.exit(1);
  }
}

/**
 * Main execution
 * Generates the barrel file and provides feedback
 */
function main() {
  console.log("🚀 Schema watch script started");
  console.log(`📂 Watching: ${schemasDir}`);
  console.log(`📝 Target: ${barrelFile}`);
  console.log("─".repeat(50));

  generateBarrelFile();

  console.log("─".repeat(50));
  console.log("\n✨ Schema barrel file generation complete");
}

// Execute the script
main();
