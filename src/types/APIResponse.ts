export type APIResponse<T> = {
  ok: boolean;
  result: T;
};

export type APIErrorResponse = {
  ok: boolean;
  error: {
    message: string;
    stack?: typeof Error.prototype.stack;
  };
};
