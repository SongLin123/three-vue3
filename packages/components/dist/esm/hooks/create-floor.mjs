import '../node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.mjs';
import { ShaderMaterial, PlaneGeometry, Mesh } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';
import { onMounted } from '../node_modules/.pnpm/@vue_runtime-core@3.3.4/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.mjs';

function createFloor(scene) {
  let commonUniforms = {
    height1: { type: "f", value: 100 },
    u_time: { type: "f", value: 0 },
    max_radius: { type: "f", value: 1414.213562373095 }
  };
  window.commonUniforms = commonUniforms;
  let shadermat = new ShaderMaterial({
    uniforms: {
      height1: { type: "f", value: 50 },
      band_width: { type: "f", value: 30 },
      u_time: commonUniforms.u_time,
      max_radius: commonUniforms.max_radius
    },
    vertexShader: document.getElementById("vertexShader2").textContent,
    fragmentShader: document.getElementById("fragmentShader2").textContent,
    transparent: true
  });
  let grid = null;
  onMounted(() => {
    const geometry = new PlaneGeometry(1e3, 1e3, 500, 500);
    geometry.rotateX(-Math.PI / 2);
    grid = new Mesh(geometry, shadermat);
    grid.userData = { type: "floor" };
    scene.add(grid);
    requestAnimationFrame(function animate() {
      let v1 = 50 + 10 * Math.sin(Date.now() / 1e3);
      commonUniforms.height1.value = v1;
      commonUniforms.u_time.value = Date.now() * 1e-3 % 3.6;
      requestAnimationFrame(animate);
    });
  });
  return { grid, commonUniforms };
}

export { createFloor };
//# sourceMappingURL=create-floor.mjs.map
