import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MemoryRouter as Router, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
import Films from "./Films";

const endpoint = "https://swapi.dev/api/films/";

const meta: Meta<typeof Films> = {
  title: "Demos/React Router + RQ/Page Stories/Films",
  component: Films,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Films>;

const defaultQueryClient = new QueryClient();

export const DefaultBehavior: Story = {
  render: () => (
    <QueryClientProvider client={defaultQueryClient}>
      <Router initialEntries={["/films"]}>
        <Route exact path="/films">
          <Films endpoint={endpoint} />
        </Route>
      </Router>
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
      <Router initialEntries={["/films"]}>
        <Route exact path="/films">
          <Films endpoint={endpoint} />
        </Route>
      </Router>
    </QueryClientProvider>
  ),
};

export const MockedSuccess: Story = {
  ...MockTemplate,
  parameters: {
    msw: {
      handlers: [
        rest.get(endpoint, (req, res, ctx) => {
          return res(
            ctx.json({
              results: [
                {
                  title: "(Mocked) A New Hope",
                  episode_id: 4,
                  release_date: "1977-05-25",
                  url: "http://swapi.dev/api/films/1/",
                },
                {
                  title: "(Mocked) Empire Strikes Back",
                  episode_id: 5,
                  release_date: "1980-05-17",
                  url: "http://swapi.dev/api/films/2/",
                },
              ],
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
        rest.get("https://swapi.dev/api/films/", (req, res, ctx) => {
          return res(ctx.delay(800), ctx.status(403));
        }),
      ],
    },
  },
};
