/** API error payloads: flat `{ message }` or nested `{ error: { code, message } }`. */
export type ApiErrorBody = {
  message?: string
  error?: {
    code?: string
    message?: string
  }
}
