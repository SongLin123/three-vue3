import { EdgesGeometry, LineSegments, LineBasicMaterial } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';

function useEdge(target, scene) {
  const edges = new EdgesGeometry(target.geometry);
  const line = new LineSegments(
    edges,
    new LineBasicMaterial({ color: "red" })
  );
  scene.add(line);
  function removeEdge() {
    scene.remove(line);
  }
  return removeEdge;
}

export { useEdge };
//# sourceMappingURL=use-edge.mjs.map
