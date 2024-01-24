const fs = require("fs");
const client = require("https");

const tilesetBaseUrl = "https://www.cleardarksky.com/maps/lp/tiles/tile_";

function downloadImage(url, filepath) {
  console.log("get", url);
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

const downloadAll = async () => {
  for (let z = 1; z <= 6; z++) {
    for (let x = 1; x <= Math.pow(2, z); x++) {
      for (let y = 1; y <= Math.pow(2, z); y++) {
        try {
          await downloadImage(
            `${tilesetBaseUrl}${z}_${x}_${y}.png`,
            `./darkSky/tile_${z}_${x}_${y}.png`
          );
        } catch (e) {
          console.log("nope");
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 100 + Math.random() * 500)
        );
      }
    }
  }
};

downloadAll();
