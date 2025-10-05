import { Ratings } from "./ratings.interface";

export interface Question {
  id: keyof Ratings;
  title: string;
  description: string;
}