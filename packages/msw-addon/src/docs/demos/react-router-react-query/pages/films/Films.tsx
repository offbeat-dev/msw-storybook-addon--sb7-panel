import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetch } from "../../utils";
import { FilmProps } from "src/docs/components/FilmCard";

export default function Films({ endpoint }: { endpoint: string }) {
  const { data, status } = useQuery("films", () => fetch(endpoint)) as {
    data: {
      results: FilmProps[];
    };
    status: string;
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error :(</p>;
  }

  return (
    <div>
      <h2>Films</h2>
      {data.results.map((film) => {
        const filmUrlParts = film.url.split("/").filter(Boolean);
        const filmId = filmUrlParts[filmUrlParts.length - 1];
        return (
          <article key={filmId}>
            <Link to={`/films/${filmId}`}>
              <h4>
                {film.episode_id}. {film.title}{" "}
                <em>
                  ({new Date(Date.parse(film.release_date)).getFullYear()})
                </em>
              </h4>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
