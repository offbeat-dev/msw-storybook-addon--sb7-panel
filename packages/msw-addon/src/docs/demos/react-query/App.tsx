import React from "react";
import { useQuery } from "react-query";
import FilmCard, { FilmProps } from "../../components/FilmCard";
import { AppProps } from "../axios/App";

function fetchFilms(endpoint: string) {
  return fetch(endpoint)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .then((res) => res.json())
    .then((data) => data.results);
}

function useFetchFilms(endpoint: string) {
  const { status, data } = useQuery("films", fetchFilms.bind(null, endpoint));

  return {
    status,
    films: data,
  };
}

export const App = ({ endpoint }: AppProps) => {
  const { status, films } = useFetchFilms(endpoint) as {
    status: string;
    films: FilmProps[];
  };

  if (status === "loading") {
    return <p>Fetching Star Wars data...</p>;
  }

  if (status === "error") {
    return <p>Could not fetch Star Wars data</p>;
  }

  return (
    <div className="films-grid">
      {films.map((film: FilmProps) => (
        <FilmCard key={film.episode_id} film={film} />
      ))}
    </div>
  );
};
