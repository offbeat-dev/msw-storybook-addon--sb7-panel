import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { graphql } from "msw";
import { App } from "./App";

const queryName = "AllFilmsQuery";
const query = `query ${queryName} {
        allFilms {
          films {
            title
            episode_id: episodeID
            opening_crawl: openingCrawl
          }
        }
      }`;
const clientUri = "https://swapi-graphql.netlify.app/.netlify/functions/index";

const meta: Meta<typeof App> = {
  title: "Demos/Apollo",
};
export default meta;
type Story = StoryObj<typeof App>;

const defaultClient = new ApolloClient({
  uri: clientUri,
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

export const DefaultBehavior: Story = {
  args: {
    queryName,
    query,
  },
  render: (args) => (
    <ApolloProvider client={defaultClient}>
      <App {...args} />
    </ApolloProvider>
  ),
};

const mockedClient = new ApolloClient({
  uri: clientUri,
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
  args: {
    ...DefaultBehavior.args,
  },
  render: (args) => (
    <ApolloProvider client={mockedClient}>
      <App {...args} />
    </ApolloProvider>
  ),
  parameters: {
    msw: {
      clientUri,
      handlers: [
        graphql.query(queryName, (req, res, ctx) => {
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
  args: {
    ...DefaultBehavior.args,
  },
  render: (args) => (
    <ApolloProvider client={mockedClient}>
      <App {...args} />
    </ApolloProvider>
  ),
  parameters: {
    msw: {
      clientUri,
      handlers: [
        graphql.query(queryName, (req, res, ctx) => {
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
