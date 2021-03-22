#version 150
#moj_import <fog.glsl>
uniform sampler2D Sampler0;
uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in float vertexDistance;
in vec4 vertexColor;
in vec2 texCoord0;
in vec4 normal;
out vec4 fragColor;

// have multiple arrays of uvec2
const vec4 arr1[] = vec4[](vec4(1,2,1,2),vec4(1,2,1,2));

void main() {
    int x = int(texCoord0.x * ${dimensions.width});
    int y = int(texCoord0.y * ${dimensions.height});
    vec4 vtc = vertexColor;
    for(int i = 0; i < ${content.arr1.length}; i++) {
        if (x >= arr1[i].x && x <= arr1[i].y && y >= arr1[i].z && y <= arr1[i].w) vtc = vec4(1.0,1.0,1.0,1.0); 
    }
    for(int i = 0; i < ${content.arr2.length}; i++) {
        if (x >= arr2[i].x && x <= arr2[i].y && y == arr2[i].z) vtc = vec4(1.0,1.0,1.0,1.0); 
    }
    for(int i = 0; i < ${content.arr3.length}; i++) {
        if (x == arr3[i].x && y >= arr3[i].y && y <= arr1[i].z) vtc = vec4(1.0,1.0,1.0,1.0); 
    }
    for(int i = 0; i < ${content.arr3.length}; i++) {
        if (x == arr4[i].x && y == arr4[i].y) vtc = vec4(1.0,1.0,1.0,1.0); 
    }
    vec4 color = texture(Sampler0, texCoord0) * vtc * ColorModulator;
    fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
    }