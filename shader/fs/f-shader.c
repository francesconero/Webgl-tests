precision mediump float;

uniform vec2 mouseP;

void main(void) {
float density = 15.0;
float dist_mouse = length(gl_FragCoord.xy-mouseP);
vec2 pos = mod(gl_FragCoord.xy, vec2(density)*2.0) - vec2(density);
float dist_squared = dot(pos, pos);
float result = exp(-0.0005*(0.1*dist_mouse*dist_mouse+density*dist_squared));
gl_FragColor = vec4(result, result, result, 1.0);
}
