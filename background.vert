attribute vec3 aPosition;

void main() {
  // Copia a posição dos vértices para renderizar o plano na tela inteira
  gl_Position = vec4(aPosition, 1.0);
}