import React from "react";
import { News } from "../types";

type NewsHeaderProps = {
  news: Pick<News, "title" | "author" | "source">;
};

const NewsHeader: React.FC<NewsHeaderProps> = ({ news }) => {
  return (
    <div className="mb-4">
      <h2 className="mb-1 text-4xl font-semibold">{news.title}</h2>
      <h3 className="text-[#6e6e6e]">
        {news.author} - {news.source.name}
      </h3>
    </div>
  );
};

export default NewsHeader;
