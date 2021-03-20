# Luminescence

## How to use
`node index <picture>`
It accepts relative and absolute paths
**Examples:**
```
node index picture
node index ./picture
node index C://folder/picture
```
## How to colour

First save the atlas you want to use as a picture.
Then you want to colour in the pixels you want to be emissive, with
the colour rgba(255,255,127,255).
Make sure to save it after editing and run it through the script.
The script will spit out `output.txt` which contains all the necessary if-statements
you need to paste into your shader.
It assumes that `vec4 vtc = vertexColor` and that `vec4 color = texture(Sampler0, texCoord0) * vtc * ColorModulator;`.

## Compiled version
If you use the compiled version the syntax is practically the same
`luminescence <picture>`
