precision mediump float;

uniform sampler2D u_input; //the input texture
uniform vec2 u_blockCount;
uniform float a;
uniform float b;

varying vec2 v_texCoord;
float du = 1.0/u_blockCount.x; //the width of the cells
float dv = 1.0/u_blockCount.y; //the height of the cells
 
/*
Any live cell with fewer than two live neighbours dies,
  as if caused by under-population.
Any live cell with two or three live neighbours
  lives on to the next generation.
Any live cell with more than three live neighbours dies,
  as if by overcrowding.
Any dead cell with exactly three live neighbours
  becomes a live cell, as if by reproduction.
*/
 
void main() {
  int count = 0;
 
  vec4 C = texture2D( u_input, v_texCoord );
  vec4 E = texture2D( u_input, vec2(mod(v_texCoord.x + du, du*u_blockCount.x), v_texCoord.y) );
  vec4 N = texture2D( u_input, vec2(v_texCoord.x, mod(v_texCoord.y + dv, dv*u_blockCount.y)) );
  vec4 W = texture2D( u_input, vec2(mod(v_texCoord.x - du, du*u_blockCount.x), v_texCoord.y) );
  vec4 S = texture2D( u_input, vec2(v_texCoord.x, mod(v_texCoord.y - dv, dv*u_blockCount.y)) );
  vec4 NE = texture2D( u_input, vec2(mod(v_texCoord.x + du, du*u_blockCount.x), mod(v_texCoord.y + dv, dv*u_blockCount.y)) );
  vec4 NW = texture2D( u_input, vec2(mod(v_texCoord.x - du, du*u_blockCount.x), mod(v_texCoord.y + dv, dv*u_blockCount.y)) );
  vec4 SE = texture2D( u_input, vec2(mod(v_texCoord.x + du, du*u_blockCount.x), mod(v_texCoord.y - dv, dv*u_blockCount.y)) );
  vec4 SW = texture2D( u_input, vec2(mod(v_texCoord.x - du, du*u_blockCount.x), mod(v_texCoord.y - dv, dv*u_blockCount.y)) );
 
  if (E.r == 1.0) { count++; }
  if (N.r == 1.0) { count++; }
  if (W.r == 1.0) { count++; }
  if (S.r == 1.0) { count++; }
  if (NE.r == 1.0) { count++; }
  if (NW.r == 1.0) { count++; }
  if (SE.r == 1.0) { count++; }
  if (SW.r == 1.0) { count++; }
 
  if ( (C.r <= b && (count == 2 ) )  ||
       (C.r >= (1.0-b) && (count==3 || count == 5)) ) {
    gl_FragColor = vec4(1.0, 0.7, 1.0, 1.0); //cell lives...
  } else {
    gl_FragColor = vec4(max(C.r-(a/5.0),0.0), 0.0, max(C.b-(a/5.0),0.0), 1.0); //cell dies...
  }
}
