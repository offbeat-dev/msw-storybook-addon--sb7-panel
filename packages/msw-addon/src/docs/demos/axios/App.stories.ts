import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { App } from "./App";

const endpoint = "https://swapi.dev/api/films/";
const films = [
  {
    title: "A New Hope",
    episode_id: 4,
    opening_crawl: `(Mocked) Rebel spaceships have won their first victory against the evil Galactic Empire.`,
  },
  {
    title: "Empire Strikes Back",
    episode_id: 5,
    opening_crawl: `(Mocked) Imperial troops are pursuing the Rebel forces across the galaxy.`,
  },
  {
    title: "Return of the Jedi",
    episode_id: 6,
    opening_crawl: `(Mocked) Luke Skywalker has returned to his home planet of Tatooine to rescue Han Solo.`,
  },
];

const meta: Meta<typeof App> = {
  title: "Demos/Axios",
  component: App,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof App>;

export const DefaultBehavior: Story = {
  args: {
    endpoint: endpoint,
  },
};

export const MockedSuccess: Story = {
  args: {
    ...DefaultBehavior.args,
  },
  parameters: {
    msw: {
      handlers: [
        rest.get(endpoint, (req, res, ctx) => {
          return res(ctx.json({ results: films }));
        }),
      ],
    },
  },
};
export const MockedError: Story = {
  ...DefaultBehavior,
  parameters: {
    msw: {
      handlers: [
        rest.get(endpoint, (req, res, ctx) => {
          return res(ctx.delay(800), ctx.status(403));
        }),
      ],
    },
  },
};
