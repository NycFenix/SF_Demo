attribute vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  // Copia a posição dos vértices para renderizar o plano na tela inteira
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition,1.0);
}