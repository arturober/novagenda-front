export interface CategoryInsert {
  name: string;
  description: string;
  bgColor: string;
  color: string;
}

export interface Category extends CategoryInsert {
  id: string;
  taskCount?: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface SingleCategoryResponse {
  category: Category;
}
