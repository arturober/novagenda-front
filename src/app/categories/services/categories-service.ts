import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoriesResponse, CategoryInsert, SingleCategoryResponse } from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  readonly #http = inject(HttpClient);

  getCategoriesResource(taskcount = false) {
    const searchParams = new URLSearchParams({ taskcount: String(taskcount) });
    return httpResource<CategoriesResponse>(() => `categories?${searchParams}`);
  }

  insertCategory(category: CategoryInsert) {
    return this.#http.post<SingleCategoryResponse>('categories', category);
  }

  deleteCategory(categoryId: string) {
    return this.#http.delete<void>(`categories/${categoryId}`);
  }

  updateCategory(categoryId: string, category: CategoryInsert) {
    return this.#http.patch<SingleCategoryResponse>(`categories/${categoryId}`, category);
  }
}
