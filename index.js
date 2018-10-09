const fs = require("fs-extra");
const path = require("path");

const config_file = path.join(process.cwd(), "parcel-plugin-change-file.js");
const package = require(path.resolve(process.cwd(), "package.json"));

let config;
if (package["parcel-plugin-change-file"]) {
  config = package["parcel-plugin-change-file"];
} else if (fs.existsSync(config_file)) {
  config = require(config_file);
} else {
  console.log(
    "No config found." +
      "parcel-plugin-change-file in package.json or parcel-plugin-change-file.js"
  );
  return;
}

function changeHtml(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" })
    .then(data => {
      if (config && config.html && config.html.length > 0) {
        for (let i = 0, l = config.html.length; i <= l; i++) {
          const exp = eval(
            `/<!-- ${config.replaceName ||
              "parcel-plugin-change-file"}-${i} -->/g`
          );
          data = data.replace(exp, config.html[i]);
        }
      }
      data = data.replace(/<!--\|/g, "");
      data = data.replace(/\|-->/g, "");
      data = data.replace(/<!--\[/g, "");
      data = data.replace(/\]-->/g, "");
      return data;
    })
    .then(data => fs.writeFile(filePath, data))
    .catch(console.error);
}

async function copyFiles(destination) {
  const p = [];
  if (config && config.copy && config.copy.length > 0) {
    for (var i = 0; i < config.copy.length; i++) {
      const el = config.copy[i];
      const source = path.resolve(process.cwd(), el);
      try {
        const copying = fs.copy(source, path.join(destination, el));
        p.push(copying);
      } catch (e) {
        console.error("Could not copy:", source);
        console.error(e);
      }
    }
  }
  return Promise.all(p)
    .then(() => (hasCopied = true))
    .catch(console.error);
}

let hasCopied = false;
module.exports = function(bundler) {
  if (process.env.CHANGE_FILE != "false") {
    bundler.on("bundled", bundle => {
      if (bundle.type === "html") {
        changeHtml(bundle.name);
      }

      if (!hasCopied) {
        const bundleDir = path.dirname(bundle.name);
        copyFiles(bundleDir);
      }
    });
  }
};
