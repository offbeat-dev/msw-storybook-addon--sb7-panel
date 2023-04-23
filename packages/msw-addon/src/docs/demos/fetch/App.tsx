import React, { useState, useEffect } from "react";
import FilmCard from "../../components/FilmCard";
import { AppProps } from "../axios/App";

function useFetchFilms(endpoint: string) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  useEffect(() => {
    setStatus("loading");

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setStatus("success");
        setData(data.results);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return {
    status,
    data,
  };
}

export const App = ({ endpoint }: AppProps) => {
  const { status, data: films } = useFetchFilms(endpoint);

  if (status === "loading") {
    return <p>Fetching Star Wars data...</p>;
  }

  if (status === "error") {
    return <p>Could not fetch Star Wars data</p>;
  }

  return (
    <div className="films-grid">
      {films.map((film) => (
        <FilmCard key={film.episode_id} film={film} />
      ))}
    </div>
  );
};
