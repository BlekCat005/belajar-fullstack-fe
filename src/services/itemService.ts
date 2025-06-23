import instance from "@/lib/instance"; // Pastikan path ini benar
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
 * Mengambil data barang dengan paginasi.
 * @param page - Nomor halaman yang ingin diambil.
 * @param limit - Jumlah item per halaman.
 * @returns Promise<PaginatedItemsResponse>
 */
export const getItems = async (
  page: number,
  limit: number
): Promise<PaginatedItemsResponse> => {
  const response = await instance.get("/items", {
    params: {
      page,
      limit,
    },
  });
  // Kita kembalikan seluruh objek `response.data` yang berisi `data` dan `pagination`
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
