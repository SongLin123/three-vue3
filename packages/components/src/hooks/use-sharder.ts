import * as THREE from "three";

export function useSharder(target: THREE.Mesh, scene: THREE.Scene) {
  let shadermat3 = new THREE.ShaderMaterial({
    uniforms: { height1: window.commonUniforms.height1 },
    vertexShader: document.getElementById("vertexShader1")!.textContent,
    fragmentShader: document.getElementById("fragmentShader1")!.textContent,
    transparent: true,
  });
  const oldmat = target.material;
  target.material = shadermat3;

  function removeSharder() {
    target.material = oldmat;
  }

  return removeSharder;
}
