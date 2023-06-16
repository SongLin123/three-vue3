//  gui
import { GUI } from "dat.gui";
import { onUnmounted, onBeforeUnmount } from "vue";

type T = Record<string, number[]> | number[];
export const createGui = (
  gui: GUI | null,
  {
    target,
    name,
    field,
  }: {
    target: Record<string, any>;
    name?: string;
    field: Record<string, T>;
  }
) => {
  const folder = gui?.addFolder(name || "Model");

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
      folder.add(target, iterator, ...(field[iterator] as number[]));
    }
  }

  onBeforeUnmount(() => {
    if (gui) {
      try {
        gui.destroy();
      } catch (error) {}
      gui = null;
    }
  });
};
