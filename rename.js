const fs = require("fs");
const path = require("path");

// Function to convert a string to CamelCase format
function toCamelCase(str) {
  // Remove "-" symbols and split the string into words
  const words = str.split("-");

  // Convert each word to CamelCase format
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      // The first word remains unchanged
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      // For the rest of the words, the first letter is in lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Join the words back into a string
  const camelCaseStr = camelCaseWords.join("");

  return camelCaseStr;
}

// Get the current directory
const rootDir = process.cwd();

// Get the list of files in the current directory
fs.readdir(rootDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Filter the list of files, keeping only files without .js and .ts extensions and not the rename.js script
  const filteredFiles = files.filter((file) => {
    return (
      fs.statSync(path.join(rootDir, file)).isFile() &&
      !file.endsWith(".js") &&
      !file.endsWith(".ts") &&
      file !== "rename.js"
    );
  });

  // Process each file
  filteredFiles.forEach((file) => {
    // Create a folder with a CamelCase name
    const folderName = toCamelCase(file.slice(0, file.lastIndexOf(".")));

    const folderPath = path.join(rootDir, folderName);
    fs.mkdirSync(folderPath);

    // Move the file to this folder
    const oldFilePath = path.join(rootDir, file);
    const newFilePath = path.join(folderPath, "index.tsx");
    fs.renameSync(oldFilePath, newFilePath);

    console.log(
      `File "${file}" has been moved to folder "${folderName}" and renamed to "index.tsx"`
    );
  });
});
