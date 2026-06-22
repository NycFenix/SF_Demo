precision mediump float;

varying vec2 vTexCoord; // Mapeia as coordenadas da textura no plano
varying vec3 vNormal;
varying vec3 vViewDir;

uniform float uTime;
uniform sampler2D uTextTexture; // Recebe o buffer contendo o texto gerado

void main() {
  // Captura a máscara do texto enviado pelo p5.js
  vec4 textAlpha = texture2D(uTextTexture, vTexCoord);
  
  // Se o pixel atual não fizer parte das letras do texto, ele é descartado (invisível)
  if (textAlpha.r < 0.1) {
    discard;
  }

  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);
  
  // Efeito Fresnel para o efeito vítreo nas bordas das letras
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  
  vec3 baseBlue = vec3(0.0, 0.6, 0.9); 
  vec3 highlightColor = vec3(0.9, 0.98, 1.0); 
  
  float specular = pow(max(dot(reflect(-viewDir, normal), vec3(0.0, 1.0, 0.5)), 0.0), 16.0);
  float wave = sin(uTime * 3.0) * 0.05;
  
  vec3 finalColor = mix(baseBlue, highlightColor, fresnel + specular + wave);
  float alpha = mix(0.7, 1.0, fresnel + specular) * textAlpha.a;
  
  gl_FragColor = vec4(finalColor, alpha);
}