export type Scope<TSchema = Document> = {
  [key: string]: {
    [key in keyof TSchema]?: 0 | 1 | `$${string}`;
  };
};
