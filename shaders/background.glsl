precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Fuitiger Aero: Azul - Verde - Branco
    vec3 colorTop = vec3(0.37, 0.72, 0.88);
    vec3 colorBottom = vec3(0.4, 0.89, 0.61);
    vec3 mixed = mix(colorBottom, colorTop, st.y);


    // Brilho central
    float lightGlow = 1.0 - (distance(st, vec2(1.0, 1.0)) / 1.9);
    lightGlow = smoothstep(0.2, 2.5, lightGlow);
    lightGlow = clamp(lightGlow, 0.0, 1.0);

    mixed += vec3(0.5, 0.9, 1.0) * lightGlow;

    // BOLHAS

    float onda = sin(st.x * 10.0 + u_time * 2.0) * cos(st.y *10.0 + u_time * 2.0);
    mixed += smoothstep(0.99, 1.0, sin(onda*5.0)) * 0.15;

    gl_FragColor = vec4(mixed, 1.0);
    }