import React from "react";
import { News } from "@app-types";

type NewsHeaderProps = {
  news: Pick<News, "title" | "author" | "source">;
};

const NewsHeader: React.FC<NewsHeaderProps> = React.memo(({ news }) => {
  return (
    <div className="mb-4">
      <h2 className="mb-1 text-2xl leading-tight font-semibold">
        {news.title}
      </h2>
      <p className="font-sans text-sm font-medium text-attribution">
        {news.author}, {news.source}
      </p>
    </div>
  );
});

export default NewsHeader;
