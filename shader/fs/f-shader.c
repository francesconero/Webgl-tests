precision mediump float;

uniform vec2 mouseP;
uniform vec2 mouseV;

void main(void) {
float density = 5.0;
vec2 dist_mouse_v = gl_FragCoord.xy-mouseP;
float dist_fac = length(dist_mouse_v);
float vel_fac = dot(-mouseV, dist_mouse_v);
vec2 pos = mod(gl_FragCoord.xy, 2.0*vec2(density)) - vec2(density);
float mod_fac = dot(pos, pos);
float norm_fac = exp(-0.05*(dist_fac+2.0*vel_fac+mod_fac));
gl_FragColor = vec4(norm_fac, .0, .0, 1.0);
}
