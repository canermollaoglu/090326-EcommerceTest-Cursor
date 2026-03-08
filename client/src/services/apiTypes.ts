/**
 * ECommerce API (ECommerceTest backend) response/request tipleri
 */

export type ProductResponseDto = {
  id: string;
  productName: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string | null;
  createdDate: string;
  modifiedDate: string | null;
};

export type ProductCreateDto = {
  productName: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  categoryId: string;
};

export type ProductUpdateDto = ProductCreateDto & { id: string };

export type CategoryResponseDto = {
  id: string;
  name: string | null;
  description: string | null;
  createdDate: string;
};

export type CategoryCreateDto = {
  name: string | null;
  description: string | null;
};

export type CategoryUpdateDto = {
  id: string;
  name: string | null;
  description: string | null;
};
