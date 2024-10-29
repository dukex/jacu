export class App {
	async handler(): Promise<(request: Request, info?: Deno.ServeHandlerInfo) => Promise<Response>> {
		return async function(
			request: Request,
			info: Deno.ServeHandlerInfo = {}
		) {
			const req = request;
			console.log("Method:", req.method);

			const url = new URL(req.url);
			console.log("Path:", url.pathname);
			console.log("Query parameters:", url.searchParams);

			console.log("Headers:", req.headers);

			if (req.body) {
				const body = await req.text();
				console.log("Body:", body);
			}


			return new Response("Hello, World!");

		}

	}

	async listen() {
		const handler = await this.handler() 

		await Deno.serve({ port: 9000 }, handler);
	}

}
