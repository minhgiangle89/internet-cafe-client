export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: { [key: string]: string[] };
}

export interface ApiResponseBase {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] };
}
