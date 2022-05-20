# DO NOT USE: This is outdated, use [this](https://github.com/ShockMicro/VanillaDynamicEmissives) instead.

# Lumen

## How to use
`node src/index <picture>`

It accepts relative and absolute paths.

**Examples:**
```
node src/index picture
node src/index media/picture
node src/index ./picture
node src/index C://folder/picture
```
## How to colour

I have added the default atlas for 21w11a in the media folder for you to download.

First save the atlas you want to use as a picture.
Secondly you want to colour in the pixels you want to be emissive, with
the colour `rgba(255,255,127,255)` or `#ffff7f` in hex.
Make sure to save it after editing and run it through the script.
The script will spit out either `output.txt` which contains all the necessary if-statements
you need to paste into your shader or a fully-fledged resource pack (*How cool is that!*). Currently the resource pack option only works for blocks that use `rendertype_solid`, but my first priority is to change this :D!

It assumes that `vec4 vtc = vertexColor` and that `vec4 color = texture(Sampler0, texCoord0) * vtc * ColorModulator;` in the fsh.

## Compiled version
If you use the compiled version the syntax is practically the same:

```lumen <picture>```
## Bundled version
The bundled version does not include the node runtime, hence why that must be installed on the pc

```node lumen <picture>```
