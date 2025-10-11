import { Ratings } from "./ratings.interface";

export interface ProfessorData {
  id: number;
  name: string;
  course: string;
  avatar: string;
  stats: ProfessorStats;
  ratings: Ratings;
  recentComments: string[];
  commentsStats?: CommentStats;
}

export interface Professor {
  value: any;
  label: string;
  description: string;
}

export interface ProfessorStats {
  totalResponses: number;
  averageRating: number;
  completionRate: number;
  semesterAverage: number;
}

export interface CommentStats{
  totalComments: number;
  positiveComments: number;
  negativeComments: number;
  positivePercentage: number;
  negativePercentage: number;
}
