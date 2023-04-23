import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
import App from "./App";

const endpoint = "https://swapi.dev/api/films/";

const meta: Meta<typeof App> = {
  title: "Demos/React Router + RQ",
  component: App,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof App>;

const defaultQueryClient = new QueryClient();

export const DefaultApp: Story = {
  render: () => (
    <QueryClientProvider client={defaultQueryClient}>
      <Router>
        <App endpoint={endpoint} />
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

export const MockedApp: Story = {
  render: () => (
    <QueryClientProvider client={mockedQueryClient}>
      <Router>
        <App endpoint={endpoint} />
      </Router>
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers: {
        films: [
          rest.get("https://swapi.dev/api/films/", (req, res, ctx) => {
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
          rest.get("https://swapi.dev/api/films/1", (req, res, ctx) => {
            return res(
              ctx.json({
                title: "(Mocked) A New Hope",
                episode_id: 4,
                opening_crawl: `Rebel spaceships have won their first victory against the evil Galactic Empire.`,
                characters: [
                  "http://swapi.dev/api/people/1/",
                  "http://swapi.dev/api/people/2/",
                ],
              })
            );
          }),
          rest.get("https://swapi.dev/api/films/2", (req, res, ctx) => {
            return res(
              ctx.json({
                title: "(Mocked) Empire Strikes Back",
                episode_id: 5,
                opening_crawl: `Imperial troops are pursuing the Rebel forces across the galaxy.`,
                characters: ["http://swapi.dev/api/people/1/"],
              })
            );
          }),
        ],
        people: [
          rest.get("https://swapi.dev/api/people/", (req, res, ctx) => {
            return res(
              ctx.json({
                results: [
                  {
                    name: "(Mocked) Luke Skywalker",
                    url: "http://swapi.dev/api/people/1/",
                  },
                  {
                    name: "(Mocked) C-3PO",
                    url: "http://swapi.dev/api/people/2/",
                  },
                ],
              })
            );
          }),
          rest.get("https://swapi.dev/api/people/1", (req, res, ctx) => {
            return res(
              ctx.json({
                name: "(Mocked) Luke Skywalker",
                birth_year: "19BBY",
                eye_color: "blue",
                hair_color: "blond",
                height: "172",
                mass: "77",
                homeworld: "http://swapi.dev/api/planets/1/",
                films: [
                  "http://swapi.dev/api/films/1/",
                  "http://swapi.dev/api/films/2/",
                ],
              })
            );
          }),
          rest.get("https://swapi.dev/api/people/2", (req, res, ctx) => {
            return res(
              ctx.json({
                name: "(Mocked) C-3PO",
                birth_year: "112BBY",
                eye_color: "yellow",
                hair_color: "n/a",
                height: "167",
                mass: "75",
                homeworld: "http://swapi.dev/api/planets/1/",
                films: ["http://swapi.dev/api/films/1/"],
              })
            );
          }),
        ],
        planets: rest.get("https://swapi.dev/api/planets/", (req, res, ctx) => {
          return res(
            ctx.json({
              name: "(Mocked) Tatooine",
            })
          );
        }),
      },
    },
  },
};

export const MockedFilmSubsection: Story = {
  render: () => (
    <QueryClientProvider client={mockedQueryClient}>
      <Router initialEntries={["/films/1"]}>
        <App endpoint={endpoint} />
      </Router>
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers: [
        rest.get("https://swapi.dev/api/films/1", (req, res, ctx) => {
          return res(
            ctx.json({
              title: "(Mocked) A New Hope",
              episode_id: 4,
              opening_crawl: `Rebel spaceships have won their first victory against the evil Galactic Empire.`,
              characters: [
                "http://swapi.dev/api/people/1/",
                "http://swapi.dev/api/people/2/",
              ],
            })
          );
        }),
        rest.get("https://swapi.dev/api/people/1", (req, res, ctx) => {
          return res(
            ctx.json({
              name: "(Mocked) Luke Skywalker",
              birth_year: "19BBY",
              eye_color: "blue",
              hair_color: "blond",
              height: "172",
              mass: "77",
              homeworld: "http://swapi.dev/api/planets/1/",
              films: [
                "http://swapi.dev/api/films/1/",
                "http://swapi.dev/api/films/2/",
              ],
            })
          );
        }),
        rest.get("https://swapi.dev/api/people/2", (req, res, ctx) => {
          return res(
            ctx.json({
              name: "(Mocked) C-3PO",
              birth_year: "112BBY",
              eye_color: "yellow",
              hair_color: "n/a",
              height: "167",
              mass: "75",
              homeworld: "http://swapi.dev/api/planets/1/",
              films: ["http://swapi.dev/api/films/1/"],
            })
          );
        }),
      ],
    },
  },
};
