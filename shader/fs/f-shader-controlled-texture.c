precision mediump float;

// our texture
uniform sampler2D u_tex;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main(void) {
// Look up a color from the texture.
gl_FragColor = texture2D(u_tex, v_texCoord);
}
