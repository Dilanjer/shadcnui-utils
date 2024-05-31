const fs = require("fs");
const path = require("path");

// Функция для преобразования строки в формат CamelCase
function toCamelCase(str) {
  // Удаляем символы "-" и разбиваем строку на слова
  const words = str.split("-");

  // Преобразуем каждое слово в формат CamelCase
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      // Первое слово остается без изменений
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      // Для остальных слов первая буква в нижнем регистре
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Объединяем слова обратно в строку
  const camelCaseStr = camelCaseWords.join("");

  return camelCaseStr;
}

// Получаем текущую директорию
const rootDir = process.cwd();

// Получаем список файлов в текущей директории
fs.readdir(rootDir, (err, files) => {
  if (err) {
    console.error("Ошибка чтения директории:", err);
    return;
  }

  // Фильтруем список файлов, оставляя только файлы без расширения .js и .ts и не являющиеся скриптом rename.js
  const filteredFiles = files.filter((file) => {
    return (
      fs.statSync(path.join(rootDir, file)).isFile() &&
      !file.endsWith(".js") &&
      !file.endsWith(".ts") &&
      file !== "rename.js"
    );
  });

  // Проходим по каждому файлу
  filteredFiles.forEach((file) => {
    // Создаем папку с названием CamelCase
    const folderName = toCamelCase(file.slice(0, file.lastIndexOf(".")));

    const folderPath = path.join(rootDir, folderName);
    fs.mkdirSync(folderPath);

    // Перемещаем файл в эту папку
    const oldFilePath = path.join(rootDir, file);
    const newFilePath = path.join(folderPath, "index.tsx");
    fs.renameSync(oldFilePath, newFilePath);

    console.log(
      `Файл "${file}" был перемещен в папку "${folderName}" и переименован в "index.tsx"`
    );
  });
});
