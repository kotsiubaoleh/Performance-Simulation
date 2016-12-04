precision mediump float;
uniform vec2 mouse;
varying vec4 position;

void main() {
    float y  = 1.0 - mouse.y;
    float distance = length(vec2(mouse.x, y) - position.xy);
    vec4 color = vec4(0,0,0,1);
    if (abs(mouse.x - position.x) < 0.01) color.r = 1.0;
    if (abs(y - position.y) < 0.01) color.b = 1.0;

  gl_FragColor = color;
}
