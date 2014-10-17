precision mediump float;

uniform int time;
uniform vec2 screenSize;

int int_mod(int x, int y){
    return x-(x/y)*y;
}

void main(void) {
int density = 5;
int velocity = 5;
int time_mod = int_mod(time, 2*density*velocity);
float time_mod_f = float(time_mod)/float(velocity);
vec2 shifted_coord = vec2(gl_FragCoord.x-time_mod_f, gl_FragCoord.y);
vec2 v_fac = mod(shifted_coord, vec2(2.0*float(density))) - vec2(float(density));
float fac = dot(v_fac, v_fac);
gl_FragColor = vec4((fac>10.0)?1.0:0.0, .0, .0, 1.0);
}

