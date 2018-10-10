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
}

function changeHtml(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" })
    .then(data => {
      if (config && config.inject && config.inject.length > 0) {
        const injection_point = data.indexOf("</head>");
        let injection = "";
        for (let i = 0; i < config.inject.length; i++)
          injection += config.inject[i];
        data =
          data.slice(0, injection_point) +
          injection +
          data.slice(injection_point);
      }

      return data;
    })
    .then(data => fs.writeFile(filePath, data))
    .catch(console.error);
}

async function copyFiles(dist_folder) {
  const p = [];
  if (config && config.copy && config.copy.length > 0) {
    for (var i = 0; i < config.copy.length; i++) {
      const el = config.copy[i];
      const source = path.resolve(process.cwd(), el);
      const destination = path.join(dist_folder, el);
      p.push(fs.copy(source, destination));
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
