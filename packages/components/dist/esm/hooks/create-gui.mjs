import '../node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.mjs';
import { onBeforeUnmount } from '../node_modules/.pnpm/@vue_runtime-core@3.3.4/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.mjs';

const createGui = (gui, {
  target,
  name,
  field
}) => {
  const folder = gui == null ? void 0 : gui.addFolder(name || "Model");
  for (const iterator of Object.keys(field)) {
    if (!(field[iterator] instanceof Array)) {
      const subFolder = folder.addFolder(iterator);
      for (const subIterator of Object.keys(field[iterator])) {
        subFolder.add(
          target[iterator],
          subIterator,
          ...field[iterator][subIterator]
        );
      }
      continue;
    } else {
      folder.add(target, iterator, ...field[iterator]);
    }
  }
  onBeforeUnmount(() => {
    if (gui) {
      try {
        gui.destroy();
      } catch (error) {
      }
      gui = null;
    }
  });
};

export { createGui };
//# sourceMappingURL=create-gui.mjs.map
