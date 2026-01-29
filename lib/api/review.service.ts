import getToken from '../getToken';
import { API_BASE_URL } from '../config';

export interface CreateReviewRequest {
  rating: number;
  loanType: string;
  loanAmount: number;
  description: string;
  link?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
}

class ReviewService {
  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    const token = await getToken();

    const response = await fetch(`${API_BASE_URL}/api/review/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}

export const reviewService = new ReviewService();
