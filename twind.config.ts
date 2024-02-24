import { defineConfig, ThemeConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind@1.1.4";

export default {
  ...defineConfig({
    presets: [presetTailwind()],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "rgb(132, 204, 22)",
            hover: "rgb(77, 124, 15)",
          },
          secondary: "rgb(26, 46, 5)",
        },
      },
    } as ThemeConfig,
  }),
  selfURL: import.meta.url,
};
