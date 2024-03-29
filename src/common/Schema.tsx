export interface BaseResponse {
  error?: string;
}

export interface CouponData {
  coupon: string;
}

export interface Product {
  objectId: string;
  name: string;
  business: string;
  link: string;
  priceRange: Array<number>;
  variantImages: Array<string>;
  variantIndex: number;
  wishlist?: boolean;
}

export interface PostMethods {
  AddToWishList: {
    request: AddToWishListRequest;
    response: AddToWishListResponse;
  };
  DeleteFromWishList: {
    request: DeleteFromWishListRequest;
    response: DeleteFromWishListResponse;
  };
  SignIn: {
    request: SignInRequest;
    response: SignInResponse;
  };
  SignUp: {
    request: SignUpRequest;
    response: SignUpResponse;
  };
}

export interface AddToWishListRequest {
  id: string;
}

export interface AddToWishListResponse extends BaseResponse {}

export interface DeleteFromWishListRequest {
  id: string;
}

export interface DeleteFromWishListResponse extends BaseResponse {}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse extends BaseResponse {
  email: string;
  token: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse extends BaseResponse {
  email: string;
  token: string;
}

export interface GetMethods {
  Search: SearchResponse;
  SignOut: SignOutResponse;
  WishList: WishListResponse;
}
export interface SearchResponse extends BaseResponse {
  facets: {
    business: { [key: string]: number };
    departments: { [key: string]: number };
  };
  hits: Array<Product>;
  nbHits: number;
}

export interface SignOutResponse extends BaseResponse {}

export interface WishListResponse extends BaseResponse {
  products: Array<Product>;
}
