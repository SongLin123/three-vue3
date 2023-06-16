import { ShaderMaterial } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';

function useSharder(target, scene) {
  let shadermat3 = new ShaderMaterial({
    uniforms: { height1: window.commonUniforms.height1 },
    vertexShader: document.getElementById("vertexShader1").textContent,
    fragmentShader: document.getElementById("fragmentShader1").textContent,
    transparent: true
  });
  const oldmat = target.material;
  target.material = shadermat3;
  function removeSharder() {
    target.material = oldmat;
  }
  return removeSharder;
}

export { useSharder };
//# sourceMappingURL=use-sharder.mjs.map
