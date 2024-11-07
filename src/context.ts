export type HandlerFn = (ctx: Context) => Promise<Response> | Response;

export default interface Context<State = Record<string, unknown>> {
  request: Request;
  url: URL;
  info?: Deno.ServeHandlerInfo;
  state: State;
  next: () => Promise<Response>;
}

export class JacuContext<State> implements Context<State> {
  request: Request;
  url: URL;
  info?: Deno.ServeHandlerInfo;
  state: State = {} as State;
  next: () => Promise<Response>;

  constructor(
    request: Request,
    url: URL,
    next: () => Promise<Response>,
    info?: Deno.ServeHandlerInfo,
  ) {
    this.request = request;
    this.url = url;
    this.info = info;
    this.next = next;
  }
}
