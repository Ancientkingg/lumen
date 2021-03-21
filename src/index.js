const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const input = require("input");
const archiver = require("archiver");

let PNG = require("png-js");
let args = process.argv;
let picture = args.slice(2).join(" ");
if (picture) {
  if (!picture.endsWith(".png")) picture += ".png";
  if (!fs.existsSync(path.resolve(process.cwd(), picture))) {
    console.log("Invalid picture, please double-check input or file!");
  } else {
    const dimensions = sizeOf(picture);
    PNG.decode(picture, (pixels) => {
      const pixelArr = [...pixels];
      let emissivePixels = { x: [], y: [] };
      for (i = 0; i < pixelArr.length / 4; i++) {
        x = i % dimensions.height;
        y = Math.floor(i / dimensions.height);
        red = pixelArr[4 * i];
        green = pixelArr[4 * i + 1];
        blue = pixelArr[4 * i + 2];
        if (red == 255 && green == 255 && blue == 127) {
          emissivePixels.x.push(x);
          emissivePixels.y.push(y);
        }
      }
      let content = "";
      for (i = 0; i < emissivePixels.x.length; i++) {
        content += `if (x == ${emissivePixels.x[i]} && y == ${emissivePixels.y[i]} ) vtc = vec4(1.0,1.0,1.0,1.0); `;
      }
      outputPrompt((outputType) => {
        if (outputType == "Shader code") {
          fs.writeFile("output.txt", content, (err) => {
            if (err) throw err;
            console.log("Finished! Enjoy and thanks for using Luminescence! Please see output.txt");
          });
        } else {
          shaderType((shaderType) => {
            let fsh = `#version 150\n#moj_import <fog.glsl>\nuniform sampler2D Sampler0;uniform vec4 ColorModulator;uniform float FogStart;uniform float FogEnd;uniform vec4 FogColor;in float vertexDistance;in vec4 vertexColor;in vec2 texCoord0;in vec4 normal;out vec4 fragColor;void main() {int x = int(texCoord0.x * 1024);int y = int(texCoord0.y * 1024);vec4 vtc = vertexColor;${content}vec4 color = texture(Sampler0, texCoord0) * vtc * ColorModulator;fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);}`;
            let packmcmeta =
              '{"pack":{ "pack_format": 7, "description": "§cEmissive Textures by Ancientkingg"}}';
            fs.mkdir(
              process.cwd() + "/rp_placeholder/assets/minecraft/shaders/core/",
              { recursive: true },
              (err) => {
                if (err) throw err;
                fs.writeFile(
                  process.cwd() +
                    "/rp_placeholder/assets/minecraft/shaders/core/" +
                    shaderType +
                    ".fsh",
                  fsh,
                  () => {
                    if (err) throw err;
                    fs.writeFile(
                      process.cwd() + "/rp_placeholder/pack.mcmeta",
                      packmcmeta,
                      () => {
                        if (err) throw err;
                        let output = fs.createWriteStream(
                          "EmissiveTextures.zip"
                        );
                        let archive = archiver("zip");
                        output.on("close", () => {
                          console.log(archive.pointer() + " total bytes");
                        });
                        archive.on("error", (err) => {
                          if (err) throw err;
                        });
                        archive.pipe(output);
                        archive.directory("rp_placeholder/", false);
                        archive.finalize().then(() => {
                          fs.rmdir(process.cwd() + "/rp_placeholder", {
                            recursive: true,
                          },()=>{
                            console.log("Finished! Enjoy and thanks for using Luminescence! Please see EmissiveTextures.zip")
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          });
        }
      });
    });
  }
} else {
  console.log("Please input a picture");
}

async function outputPrompt(callback) {
  const outputType = await input.select(
    "Would you like to output shader code or a resource pack?",
    ["Shader code", "Resource Pack"]
  );
  callback(outputType);
}

async function shaderType(callback) {
  let shaderType = await input.select(
    "Please select the shader type to be outputted",
    [
      "rendertype_solid",
      "rendertype_cutout_mipped",
      "rendertype_cutout",
      "rendertype_entity_cutout",
      "other",
    ]
  );
  if (shaderType == "other")
    shaderType = await input.text(
      "Please input the shader type to be outputted"
    );
  callback(shaderType);
}

function getRanges(array) {
  let ranges = [],
    rstart,
    rend;
  for (i = 0; i < array.length; i++) {
    rstart = array[i];
    istart = i;
    rend = rstart;
    while (array[i + 1] - array[i] == 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart == rend ? rstart + "" : rstart + "-" + rend);
  }
  return ranges;
}

function dedupe(array) {
  let deduped = [];
  for (i = 0; i < array.length; i++) {
    if (array[i] != array[i + 1]) deduped.push(array[i]);
  }
  return deduped;
}
