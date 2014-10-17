precision mediump float;

uniform vec2 mouseP;
uniform vec2 mouseV;
uniform vec2 screenSize;
uniform int time;
uniform float a;
uniform float b;

void main(void) {
float area = sqrt(screenSize.x*screenSize.y);
vec2 dist_mouse_v = gl_FragCoord.xy-mouseP;
float a_normalized = a / area*area * 2.0;
float b_normalized = b / area;

float dist_fac = length(dist_mouse_v);

float vel_fac = abs(dot(vec2(-mouseV.y,mouseV.x), dist_mouse_v));


float norm_dist_fac = exp(-dist_fac/a_normalized);
float norm_vel_fac = 1.0/(1.0+exp(b_normalized*vel_fac));
float norm_fac = norm_dist_fac * norm_vel_fac;
gl_FragColor = vec4(norm_fac, .0, .0, 1.0);
}
