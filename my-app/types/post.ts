// A post exactly as the NestJS API returns it as JSON.
// Dates arrive as ISO strings (for example "2026-11-07T10:30:00.000Z").
export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// The fields a user fills in when creating or editing a post.
export interface PostInput {
  title: string;
  body: string;
}

// What a Server Action sends back to the form when something went wrong.
// `errors` holds readable messages; `values` lets the form keep what the
// user typed instead of clearing it.
export interface FormState {
  errors?: string[];
  values?: PostInput;
}
