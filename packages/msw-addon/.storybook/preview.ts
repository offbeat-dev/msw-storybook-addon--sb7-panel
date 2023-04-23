import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "../dist/index.mjs";
import "../src/docs/styles.css";

initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    options: {
      storySort: {
        order: ["Guides", ["Introduction", "Installation"], "Demos", ["Urql"]],
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const loaders = [mswLoader];

export default preview;
