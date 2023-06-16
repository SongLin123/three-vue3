import * as THREE from "three";

export function useEdge(target: THREE.Mesh, scene: THREE.Scene) {
  const edges = new THREE.EdgesGeometry((target as THREE.Mesh).geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: "red" })
  );
  scene.add(line);

  function removeEdge() {
    scene.remove(line);
  }

  return removeEdge;
}
