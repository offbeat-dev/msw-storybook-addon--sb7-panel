import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { createClient, Provider } from "urql";
import { graphql } from "msw";
import { App } from "./App";

const meta: Meta<typeof App> = {
  title: "Demos/Urlq",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof App>;

const defaultClient = createClient({
  url: "https://swapi-graphql.netlify.app/.netlify/functions/index",
});

export const DefaultBehavior: Story = {
  render: () => (
    <Provider value={defaultClient}>
      <App />
    </Provider>
  ),
};

const mockedClient = createClient({
  url: "https://swapi-graphql.netlify.app/.netlify/functions/index",
  requestPolicy: "network-only",
});

const MockTemplate: Story = {
  render: () => (
    <Provider value={mockedClient}>
      <App />
    </Provider>
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
  ...MockTemplate,
  parameters: {
    msw: {
      handlers: [
        graphql.query("AllFilmsQuery", (req, res, ctx) => {
          return res(
            ctx.data({
              allFilms: {
                films,
              },
            })
          );
        }),
      ],
    },
  },
};

export const MockedError: Story = {
  ...MockTemplate,
  parameters: {
    msw: {
      handlers: [
        graphql.query("AllFilmsQuery", (req, res, ctx) => {
          return res(
            ctx.delay(800),
            ctx.errors([
              {
                message: "Access denied",
              },
            ])
          );
        }),
      ],
    },
  },
};
