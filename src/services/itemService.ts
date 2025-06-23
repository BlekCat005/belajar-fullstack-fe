// src/services/itemService.ts

import instance from "@/lib/instance";
import { ItemFormValues } from "@/lib/validations/item";

// Tipe untuk data item individual
export interface Item extends ItemFormValues {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemPayload = ItemFormValues;

// Tipe baru untuk menampung seluruh respons paginasi dari backend
export interface PaginatedItemsResponse {
  data: Item[];
  pagination: {
    total: number;
    totalPages: number;
    current: number;
  };
}

/**
 * Mengambil data barang dengan paginasi, pencarian, dan pengurutan.
 * @param page - Nomor halaman yang ingin diambil.
 * @param limit - Jumlah item per halaman.
 * @param search - Kata kunci pencarian (opsional).
 * @param sortBy - Field untuk mengurutkan (opsional).
 * @param sortOrder - Urutan pengurutan (opsional, 'asc' atau 'desc').
 * @returns Promise<PaginatedItemsResponse>
 */
export const getItems = async (
  page: number,
  limit: number,
  search?: string,
  sortBy?: string, // Tambahkan parameter sortBy opsional
  sortOrder?: "asc" | "desc" // Tambahkan parameter sortOrder opsional
): Promise<PaginatedItemsResponse> => {
  const response = await instance.get("/items", {
    params: {
      page,
      limit,
      search,
      sortBy, // Kirim sortBy ke backend
      sortOrder, // Kirim sortOrder ke backend
    },
  });
  return response.data;
};

export const createItem = async (itemData: ItemPayload): Promise<Item> => {
  const response = await instance.post("/items", itemData);
  return response.data.data;
};

export const updateItem = async (
  id: string,
  itemData: Partial<ItemPayload>
): Promise<Item> => {
  const response = await instance.put(`/items/${id}`, itemData);
  return response.data.data;
};

export const deleteItem = async (id: string): Promise<Item> => {
  const response = await instance.delete(`/items/${id}`);
  return response.data.data;
};
