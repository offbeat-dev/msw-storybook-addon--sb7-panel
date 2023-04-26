import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { graphql } from "msw";
import { App } from "./App";
import { useParameter, useStoryContext } from "@storybook/preview-api";

const operationName = "AllFilmsQuery";
const graphQLClientUri =
  "https://swapi-graphql.netlify.app/.netlify/functions/index";
const mockedClient = new ApolloClient({
  uri: graphQLClientUri,
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

const meta: Meta<typeof App> = {
  title: "Demos/Apollo",
  tags: ["autodocs"],
  component: App,
  parameters: {
    msw: {
      MockProvider: ApolloProvider,
    },
  },
  decorators: [
    (Story) => {
      const context = useStoryContext();
      let { MockProvider } = useParameter("msw", {} as any);
      if (context.viewMode === "docs") {
        const m = context.id.replace(/-/g, "");
        context.args.operationName = `${operationName}${m}`;
        MockProvider = ApolloProvider;
        const handlers = context.parameters?.msw?.handlers;
        if (handlers) {
          handlers.forEach((handler: { info: { operationName: string } }) => {
            if (handler.info.operationName) {
              handler.info.operationName = handler.info.operationName + m;
            }
          });
          context.parameters.msw.handlers = handlers;
        }
      }

      return (
        <MockProvider client={mockedClient}>
          <Story />
        </MockProvider>
      );
    },
  ],
};
export default meta;
type Story = StoryObj<typeof App>;

export const DefaultBehavior: Story = {
  args: {
    operationName,
  },
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
  args: {
    ...DefaultBehavior.args,
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query(operationName, (req, res, ctx) => {
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
  parameters: {
    msw: {
      handlers: [
        graphql.query(operationName, (req, res, ctx) => {
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
