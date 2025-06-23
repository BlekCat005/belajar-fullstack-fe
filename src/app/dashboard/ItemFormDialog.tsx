"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// Impor skema validasi dan tipe datanya
import { itemFormSchema, ItemFormValues } from "@/lib/validations/item";
import { Item } from "@/services/itemService";

// Impor komponen Form dari shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Definisikan props yang akan diterima komponen ini dari parent-nya
interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null; // null untuk mode Create, berisi data untuk mode Edit
  onSubmit: (data: ItemFormValues) => Promise<void>;
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ItemFormDialogProps) {
  const isEditMode = item !== null;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  // useEffect ini akan mengisi form dengan data saat mode Edit aktif atau membersihkannya saat mode Create
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        form.reset(item);
      } else {
        form.reset({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          imageUrl: "",
        });
      }
    }
  }, [open, item, isEditMode, form]);

  const handleFormSubmit = async (data: ItemFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Barang" : "Tambah Barang Baru"}
              </DialogTitle>
              <DialogDescription>
                Isi detail barang. Klik simpan jika sudah selesai.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-4 gap-4">
                    <FormLabel className="text-right">Nama</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Nama barang..." {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-4 gap-4">
                    <FormLabel className="text-right">Harga</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-4 gap-4">
                    <FormLabel className="text-right">Stok</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid items-center grid-cols-4 gap-4">
                    <FormLabel className="text-right">Deskripsi</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="(Opsional)" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 text-right" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
