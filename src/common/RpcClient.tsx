import { PostMethods, GetMethods } from "./Schema";

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const endpoints = new Map<keyof PostMethods, string>([
  ["AddToWishList", "/wishlist/add"],
  ["DeleteFromWishList", "/wishlist/delete"],
  ["SignIn", "/signin/credentials"],
  ["SignUp", "/signup/user"],
  ["ClickMonetization", "/monetization"],
  ["ViewMonetization", "/monetization"],
]);

let postRpcClient: PostRpcClient;
export class PostRpcClient {
  static getInstance() {
    if (postRpcClient) {
      return postRpcClient;
    }

    postRpcClient = new PostRpcClient();
    return postRpcClient;
  }

  private constructor() {}

  async call<methodName extends keyof PostMethods>(
    method: methodName,
    request: PostMethods[methodName]["request"],
    credentials?: { email: string; token: string }
  ): Promise<PostMethods[methodName]["response"]> {
    const auth: { [key: string]: string } = credentials
      ? { email: credentials.email, token: credentials.token }
      : {};
    const endpoint = endpoints.get(method);
    const fetchRequest = new Request(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...auth,
      },
      body: JSON.stringify(request),
    });

    let rawResponse: Response;
    try {
      rawResponse = await fetch(fetchRequest);
    } catch (err) {
      throw err;
    }

    let response: PostMethods[methodName]["response"];
    if (rawResponse.status === 204) {
      return {};
    }

    try {
      response = await rawResponse.json();
    } catch (err) {
      throw err;
    }
    return response;
  }
}

let getRpcClient: GetRpcClient;
export class GetRpcClient {
  static getInstance() {
    if (getRpcClient) {
      return getRpcClient;
    }

    getRpcClient = new GetRpcClient();
    return getRpcClient;
  }

  private constructor() {}

  async call<methodName extends keyof GetMethods>(
    method: methodName,
    endpoint: string,
    credentials?: { email: string; token: string }
  ): Promise<GetMethods[methodName]> {
    const auth: { [key: string]: string } = credentials
      ? { email: credentials.email, token: credentials.token }
      : {};

    const fetchRequest = new Request(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...auth,
      },
    });

    let rawResponse: Response;
    try {
      rawResponse = await fetch(fetchRequest);
    } catch (err) {
      throw err;
    }

    let response: GetMethods[methodName];
    try {
      response = await rawResponse.json();
    } catch (err) {
      throw err;
    }
    return response;
  }
}
