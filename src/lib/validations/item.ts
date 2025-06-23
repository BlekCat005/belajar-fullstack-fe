import * as z from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(3, { message: "Nama barang minimal harus 3 karakter." }),
  description: z.string().optional(),
  price: z.coerce.number().min(1, { message: "Harga harus lebih dari 0." }),
  stock: z.coerce.number().int({ message: "Stok harus berupa angka bulat." }),
  imageUrl: z
    .string()
    .url({ message: "URL gambar tidak valid." })
    .optional()
    .or(z.literal("")),
});

// Kita juga bisa membuat Tipe TypeScript dari skema ini
export type ItemFormValues = z.infer<typeof itemFormSchema>;
