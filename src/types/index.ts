export type VotesType = {
  count: number;
  value: number;
};

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[];
};

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
};

export type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color?: string;
  size?: string;
  images: string[];
  discount?: number;
  currentPrice: number;
  punctuation?: PunctuationType;
  reviews?: ReviewType[];
};

export type ProductTypeList = {
  id: string;
  name: string;
  price: number;
  color?: string;
  images: string[];
  discount?: number;
  currentPrice?: number;
  description?: string;
  category?: string;
};

export type ProductStoreType = {
  id: string;
  name: string;
  images: string[];
  price: number;
  count: number;
  color?: string;
  size?: string;
  discount?: number;
  currentPrice?: number;
  thumb: string;
};

export type GtagEventType = {
  action: string;
  category: string;
  label: string;
  value: string;
};
