import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import FilmCard, { FilmProps } from "../../components/FilmCard";

const AllFilmsQuery = (query: string) => gql`
  ${query}
`;

function useFetchFilms(query: string) {
  const { loading, error, data } = useQuery(AllFilmsQuery(query));

  const films = data ? data.allFilms.films : [];

  return { loading, error, films };
}

export const App = ({
  query,
  queryName,
}: {
  queryName: string;
  query: string;
}) => {
  const { loading, error, films } = useFetchFilms(query);

  if (loading) {
    return <p>Fetching Star Wars data...</p>;
  }

  if (error) {
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
