import { defineConfig } from "@twind/core@1.1.3";
import presetTailwind from "@twind/preset-tailwind@1.1.4";

export default {
  ...defineConfig({
    presets: [presetTailwind()],
  }),
  selfURL: import.meta.url,
};
