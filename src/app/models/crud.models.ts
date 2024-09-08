export interface IProduct {
  id: number;
  describe: string;
  price: number;
  quantity: number;
  expiry_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductResponse {
  data?: IProduct;
  message: string;
  statusCode: number;
}

export interface IError {
  error: IProductError;
  message: string;
  statusCode: number;
}

export interface IProductError {
  message: string;
  statusCode: number;
}
