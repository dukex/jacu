export default interface Context {
  request: Request;
  url: URL;
  info?: Deno.ServeHandlerInfo;
}

export class JacuContext implements Context {
  request: Request;
  url: URL;
  info?: Deno.ServeHandlerInfo;

  constructor(request: Request, url: URL, info?: Deno.ServeHandlerInfo) {
    this.request = request;
    this.url = url;
    this.info = info;
  }
}
