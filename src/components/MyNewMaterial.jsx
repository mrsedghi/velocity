import * as THREE from "three";

const fragmentShader = `
  uniform vec3 thresholdColor;  // Color threshold (e.g., white: vec3(1.0))
  uniform float threshold;     // Threshold intensity (0.0 to 1.0)

  void main() {
    vec3 color = gl_FragColor.rgb;  // Get fragment color
    float luminance = dot(color, vec3(0.3, 0.3, 0.3)); // Calculate luminance : //0.2126, 0.7152, 0.0722

    // Apply color-based thresholding
    if (luminance > threshold && distance(color, thresholdColor) < threshold) {
      gl_FragColor = vec4(color, 1.0);  // Above threshold and within color range, keep color
    } else {
      gl_FragColor = vec4(vec3(0.0), 1.0);  // Below threshold or outside color range, set to black
    }
  }
`;

class MyNewMaterial extends THREE.ShaderMaterial {
	constructor(props) {
		super({
			fragmentShader,
			uniforms: props.uniforms || {},
		});
	}
}

export default MyNewMaterial;
