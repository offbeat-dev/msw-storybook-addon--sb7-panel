import React from "react";

export type FilmProps = {
  episode_id: number;
  title: string;
  opening_crawl: string;
  release_date?: string;
  url?: string;
};

const FilmCard = (props: { film: FilmProps }) => {
  const { title, opening_crawl } = props.film;
  return (
    <article className="film-card">
      <h4 className="film-title">{title}</h4>
      <p>{opening_crawl}</p>
    </article>
  );
};

export default FilmCard;
