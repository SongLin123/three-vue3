import { onMounted } from "vue";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";
import * as THREE from "three";

export function createFloor(scene: THREE.Scene) {
  let commonUniforms = {
    height1: { type: "f", value: 100.0 },
    u_time: { type: "f", value: 0.0 },
    max_radius: { type: "f", value: 1414.213562373095 },
  };
  window.commonUniforms = commonUniforms;
  let shadermat = new THREE.ShaderMaterial({
    uniforms: {
      height1: { type: "f", value: 50.0 },
      band_width: { type: "f", value: 30.0 },
      u_time: commonUniforms.u_time,
      max_radius: commonUniforms.max_radius,
    },
    vertexShader: document.getElementById("vertexShader2")!.textContent,
    fragmentShader: document.getElementById("fragmentShader2")!.textContent,
    transparent: true,
  });

  let grid: THREE.Mesh | null = null;
  onMounted(() => {
    // 添加网格地面
    // grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;

    const geometry = new THREE.PlaneGeometry(1000, 1000, 500, 500);
    geometry.rotateX(-Math.PI / 2);

    grid = new THREE.Mesh(geometry, shadermat);
    grid.userData = { type: "floor" };

    scene.add(grid);

    requestAnimationFrame(function animate() {
      let v1 = 50 + 10 * Math.sin(Date.now() / 1000);
      commonUniforms.height1.value = v1;

      commonUniforms.u_time.value = (Date.now() * 0.001) % 3.6;
      requestAnimationFrame(animate);
    });
  });
  return { grid, commonUniforms };
}
