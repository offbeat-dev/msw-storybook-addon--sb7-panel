import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
import { App } from "./App";

const endpoint = "https://swapi.dev/api/films/";

const meta: Meta<typeof App> = {
  title: "Demos/React Query",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof App>;

const defaultQueryClient = new QueryClient();

export const DefaultBehavior: Story = {
  render: () => (
    <QueryClientProvider client={defaultQueryClient}>
      <App endpoint={endpoint} />
    </QueryClientProvider>
  ),
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const MockTemplate: Story = {
  render: () => (
    <QueryClientProvider client={mockedQueryClient}>
      <App endpoint={endpoint} />
    </QueryClientProvider>
  ),
};

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

export const MockedSuccess: Story = {
  render: MockTemplate.render,
  parameters: {
    msw: {
      handlers: [
        rest.get(endpoint, (req, res, ctx) => {
          return res(
            ctx.json({
              results: films,
            })
          );
        }),
      ],
    },
  },
};

export const MockedError: Story = {
  render: MockTemplate.render,
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
