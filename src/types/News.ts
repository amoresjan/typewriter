export type NewsSource = {
  id: string;
  name: string;
};

export type News = {
  source: NewsSource;
  author: string;
  title: string;
  description: string;
  url: string;
  content: string;
};
