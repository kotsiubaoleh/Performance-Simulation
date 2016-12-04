attribute vec4 a_position;

varying vec4 position;

void main() {
  gl_Position = a_position * 2.0 - 1.0;
  position = a_position;
}
