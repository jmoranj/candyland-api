export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
