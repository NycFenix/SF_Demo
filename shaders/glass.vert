attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord; // Coordenadas de mapeamento inseridas pelo plane()

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main() {
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;
  
  vNormal = normalize(vec3(uModelViewMatrix * vec4(aNormal, 0.0)));
  vViewDir = normalize(-viewModelPosition.xyz);
  vTexCoord = aTextureCoord;
}