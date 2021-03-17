const fs = require("fs");
const path = require("path");
const sizeOf = require('image-size')

let PNG = require("png-js");
let args = process.argv;
let picture = args.slice(2).join(" ");
if (picture) {
    let filepath = path.parse(picture);
    if (!filepath.root) picture = path.resolve(__dirname, picture) + ".png";
    const dimensions = sizeOf(picture);
    PNG.decode(picture, (pixels) => {
        const pixelArr = [...pixels];
        // const groupedPixels = [];
        // while (pixelArr.length) groupedPixels.push(pixelArr.splice(0,4));
        // console.log(pixelArr)
        let emissivePixels = { x: [], y: [] };
        for (i = 0; i < (pixelArr.length / 4); i++) {
            x = i % dimensions.height;
            y = Math.floor(i / dimensions.height);
            red = pixelArr[4 * i];
            green = pixelArr[(4 * i) + 1];
            blue = pixelArr[(4 * i) + 2];
            if (red == 255 && green == 255 && blue == 127) {
                emissivePixels.x.push(x);
                emissivePixels.y.push(y);
            }
        }
        // let rangedEmissive = { x: [], y: [] };
        // rangedEmissive.x = dedupe(getRanges(emissivePixels.x));
        // rangedEmissive.y = dedupe(getRanges(dedupe(emissivePixels.y)));
        // console.log(rangedEmissive);
        // let cases_y = "";
        // let cases_x = "";
        // for(i = 0; i < emissivePixels.y.length; i++){
        //     cases_y += `case ${emissivePixels.y[i]}: vtc = vec4(1.0,1.0,1.0,1.0); break; `
        // }
        // let switch_Y = `switch (y) { ${cases_y}}`;
        // // switch_Y = "SWITCH_Y";
        // for(i = 0; i < emissivePixels.x.length; i++){
        //     cases_x += `case ${emissivePixels.x[i]}: ${switch_Y}; `
        // }
        // let content = `switch (x) { ${cases_x}}`;
        let content = "";
        for (i = 0; i < emissivePixels.x.length; i++) {
            content += `if (x == ${emissivePixels.x[i]} && y == ${emissivePixels.y[i]} ) vtc = vec4(1.0,1.0,1.0,1.0); `
        }
        fs.writeFile("output.txt", content, (err)=>{
            if (err) throw err;
            console.log("Finished!");
        })
    })
} else {
    console.log("Please input a picture");
}

function getRanges(array) {
    let ranges = [], rstart, rend;
    // let array_y = [];
    for (i = 0; i < array.length; i++) {
        rstart = array[i];
        istart = i;
        rend = rstart;
        while (array[i + 1] - array[i] == 1) {
            rend = array[i + 1]; // increment the index if the numbers sequential
            i++;
        }
        ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
        //   array_y.push(rstart == rend ? istart+'' : istart + '-' + i);
    }
    return ranges;
}

function dedupe(array) {
    let deduped = [];
    for (i = 0; i < array.length; i++) {
        if (array[i] != array[i + 1]) deduped.push(array[i]);
    }
    return deduped
}