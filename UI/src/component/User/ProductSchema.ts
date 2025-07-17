export interface ProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  product_quantity: number;
  category_name: string;
  product_category_id: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  image_url: string;
}