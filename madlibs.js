const path = require("path");
const fs = require("mz/fs");

const DIR_PATH = "./texts";

const random = max => Math.floor(Math.random() * (max + 1));
class MadLibs {
  constructor() {
    this.regex = /(\%s)/;
  }

  async start() {
    try {
      const files = await fs.readdir(DIR_PATH);
      const fileName = files[random(files.length - 1)];

      const filePath = path.join(DIR_PATH, fileName);
      console.log("Reading file... ", filePath);

      const gameData = await fs.readFile(filePath, "utf-8");

      const { title, text, descriptors, qtyWordsNeeded } = JSON.parse(gameData);

      this.title = title;
      this.text = text;
      this.descriptors = descriptors;
      this.qtyWords = qtyWordsNeeded;
      this.words = [];
      this.history = [];

      return true;
    } catch (error) {
      console.error("An error occured: ", error);
      return false;
    }
  }

  set addWord(word) {
    if (this.words.length === this.qtyWords) {
      console.log("Game Finished!");
      return false;
    }

    this.history.push([this.words, this.words.length]);
    this.words = [...this.words, word];
    return true;
  }

  undo() {
    const [words, length] = this.history.pop();

    if (!words) return false;

    this.words = words;
    return true;
  }

  finish() {
    const result = this.swapPlaceholders();
    return result;
  }

  swapPlaceholders() {
    if (this.words.length !== this.qtyWords) return false;

    const result = this.words.reduce(
      (prev, current) =>
        prev.length === 0
          ? this.text.replace(this.regex, current)
          : prev.replace(this.regex, current),
      ""
    );

    return result;
  }
}

const madlibs = new MadLibs();
madlibs.start().then(() => {
  madlibs.addWord = "Hello!";
  console.log(madlibs);
});
