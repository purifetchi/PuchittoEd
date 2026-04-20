export const vertex = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  worldPosition.xz += cameraPosition.xz;
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

export const fragment = `
varying vec3 vWorldPosition;

const vec3 thin_color = vec3(0.35);
const vec3 thick_color = vec3(0.45);

const vec3 color_axis_x = vec3(0.85, 0.2, 0.18);
const vec3 color_axis_z = vec3(0.18, 0.45, 0.85);

float getGrid(vec2 coord, float scale, float thickness) {
  vec2 grid_coord = coord / scale;
  vec2 derivative = fwidth(grid_coord);
  vec2 wrapped = abs(fract(grid_coord - 0.5) - 0.5);
  vec2 line = smoothstep(derivative * thickness, vec2(0.0), wrapped);
  return max(line.x, line.y);
}

void main() {
  vec2 uv = vWorldPosition.xz;
  float camera_dist = length(uv - cameraPosition.xz);
  float camera_height = abs(cameraPosition.y);

  float g0 = getGrid(uv, 0.1, 1.0);
  float g1 = getGrid(uv, 1.0, 1.5);
  float g2 = getGrid(uv, 10.0, 1.5);

  float level0 = 1.0 - smoothstep(2.0,  10.0,  camera_height);
  float level1 = 1.0 - smoothstep(15.0, 80.0,  camera_height);

  float alpha = g0 * 0.18 * level0
              + g1 * 0.3  * level1
              + g2 * 0.35;

  vec3 color = thin_color;
  color = mix(color, thick_color, max(g1 * level1, g2));

  float max_extent = 350.0 + camera_height * 3.0;
  float outer_fade = 1.0 - smoothstep(max_extent * 0.5, max_extent, camera_dist);
  alpha *= outer_fade;

  vec2 derivative = fwidth(uv);
  float ax = smoothstep(derivative.y * 2.0, 0.0, abs(uv.y));
  float az = smoothstep(derivative.x * 2.0, 0.0, abs(uv.x));

  color = mix(color, color_axis_x, ax);
  alpha = max(alpha, ax * 0.9 * outer_fade);

  color = mix(color, color_axis_z, az);
  alpha = max(alpha, az * 0.9 * outer_fade);

  if (alpha < 0.005) {
    discard;
  }

  gl_FragColor = vec4(color, alpha);
}
`
