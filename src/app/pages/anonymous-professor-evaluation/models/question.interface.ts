import { Ratings } from "./ratings.interface";

export interface Question {
  id: number;
  key: keyof Ratings;
  title: string;
  description: string;
}