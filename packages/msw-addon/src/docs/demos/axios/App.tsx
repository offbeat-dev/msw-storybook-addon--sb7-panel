import React, { useState, useEffect } from "react";
import axios from "axios";
import FilmCard from "../../components/FilmCard";

export interface AppProps {
  endpoint: string;
}

const useFetchFilms = (endpoint: string) => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  useEffect(() => {
    setStatus("loading");

    axios
      .get(endpoint)
      .then((res) => {
        setStatus("success");
        setData(res.data.results);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return {
    status,
    data,
  };
};

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
