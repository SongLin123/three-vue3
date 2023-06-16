import { createApp } from "vue";
// import Example from './examples/model-viewer.vue';
import Example from "./examples/scene-viewer.vue";

const app = createApp(Example);

app.mount(document.querySelector("#app") as HTMLDivElement);
