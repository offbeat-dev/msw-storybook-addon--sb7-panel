import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { graphql } from "msw";
import { App } from "./App";

const meta: Meta<typeof App> = {
  title: "Demos/Apollo",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof App>;

const defaultClient = new ApolloClient({
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
  cache: new InMemoryCache(),
});

export const DefaultBehavior: Story = {
  render: () => (
    <ApolloProvider client={defaultClient}>
      <App />
    </ApolloProvider>
  ),
};

const mockedClient = new ApolloClient({
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

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
  render: () => (
    <ApolloProvider client={mockedClient}>
      <App />
    </ApolloProvider>
  ),
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
  render: () => (
    <ApolloProvider client={mockedClient}>
      <App />
    </ApolloProvider>
  ),
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
