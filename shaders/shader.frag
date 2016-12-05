precision mediump float;
uniform vec2 mouse;
varying vec4 position;

void main() {
    float y  = 1.0 - mouse.y;
    float distance = length(vec2(mouse.x, y) - position.xy);
    vec4 color = vec4(0,0,0,1);
//    if (abs(mouse.x - position.x) < 0.01) color.r = 1.0;
//    if (abs(y - position.y) < 0.01) color.b = 1.0;
    color.r = 1.0 - smoothstep(abs(mouse.x - position.x),0.0,0.05);
    color.b = 1.0 - smoothstep(abs(y - position.y),0.0,0.05);
    color.g = pow(1.0 - length(vec2(mouse.x - position.x, y - position.y)),2.0);

  gl_FragColor = color;
}
