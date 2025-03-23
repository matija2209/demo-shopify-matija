export interface Testimonial {
  name: string | null;
  title?: string | null;
  imageUrl?: string | null;
  content: string;
  order?: number | null;
  createdAt: string;
  rating?: number | null;
  isFeatured?: boolean | null;
}

interface QAPost {
  question: string | null; // The question being asked
  askedBy: string | null; // User who asked the question
  createdAt: string | null; // Timestamp of question creation (ISO 8601)
  answers: Answer[] | null; // Array of answers (replacing 'replies')
  votes: Votes | null; // Voting information
}

interface Answer {
  answerType: string | null; // Type of answer (e.g., "text", "code", "official")
  content: string | null; // The answer content
}

interface Votes {
  upvotes: number | null; // Number of upvotes
  downvotes: number | null; // Number of downvotes
}

// Array of QA posts
export type QAPosts = QAPost[];
