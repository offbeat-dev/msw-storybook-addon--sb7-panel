import React from "react";
import { useQuery, gql } from "@apollo/client";
import FilmCard, { FilmProps } from "../../components/FilmCard";

const AllFilmsQuery = (operationName: string) => gql`
  query ${operationName} {
    allFilms {
      films {
        title
        episode_id: episodeID
        opening_crawl: openingCrawl
      }
    }
  }
`;

function useFetchFilms(operationName: string) {
  const { loading, error, data } = useQuery(AllFilmsQuery(operationName));

  const films = data ? data.allFilms.films : [];

  return { loading, error, films };
}

export const App = ({ operationName }: { operationName?: string }) => {
  const { loading, error, films } = useFetchFilms(operationName);

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
