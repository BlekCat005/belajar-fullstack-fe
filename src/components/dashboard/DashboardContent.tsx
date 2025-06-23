"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";

// Impor komponen baru kita
import { ItemFormValues } from "@/lib/validations/item";

// Impor komponen shadcn/ui
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Impor fungsi service
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  Item,
} from "@/services/itemService";
import { ItemFormDialog } from "@/app/dashboard/ItemFormDialog";

import { toast } from "sonner";

const ITEMS_PER_PAGE = 5;

export default function DashboardContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Perubahan ada di sini: Hapus baris setCurrentPage
  const fetchItems = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getItems(page, ITEMS_PER_PAGE);
      setItems(response.data);
      setTotalPages(response.pagination.totalPages);
      // Baris `setCurrentPage(response.pagination.current)` Dihapus dari sini
    } catch (err) {
      setError("Gagal memuat data barang.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependency array tetap kosong, ini sudah benar

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, fetchItems]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingItem(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (itemToEdit: Item) => {
    setEditingItem(itemToEdit);
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: ItemFormValues) => {
    try {
      if (editingItem) {
        await updateItem(editingItem._id, data);
        toast.info("Barang berhasil diperbarui.");
      } else {
        await createItem(data);
        toast.success("Barang baru berhasil ditambahkan.");
      }
      setIsFormDialogOpen(false);
      await fetchItems(currentPage);
    } catch (error) {
      console.error("Gagal menyimpan barang:", error);
      toast.error("Gagal menyimpan barang, silakan coba lagi.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete._id);
      toast.warning(`Barang "${itemToDelete.name}" berhasil dihapus.`);

      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchItems(currentPage);
      }
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      toast.error("Gagal menghapus barang, silakan coba lagi.");
    } finally {
      setItemToDelete(null);
    }
  };

  const renderContent = () => {
    if (isLoading)
      return <div className="py-10 text-center">Memuat data barang...</div>;
    if (error)
      return <div className="py-10 text-center text-red-500">{error}</div>;
    if (items.length === 0 && currentPage === 1)
      return (
        <div className="py-10 text-center border-2 border-dashed rounded-lg">
          {" "}
          <h3 className="text-2xl font-bold tracking-tight">
            {" "}
            Kamu belum punya barang{" "}
          </h3>{" "}
          <p className="text-muted-foreground">
            {" "}
            Klik tombol Tambah Barang untuk memulai.{" "}
          </p>{" "}
        </div>
      );
    return (
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">Nama Barang</TableHead>
            <TableHead className="w-[25%]">Harga</TableHead>
            <TableHead className="w-[15%] text-right">Stok</TableHead>
            <TableHead className="w-[15%] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium truncate">
                {item.name}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.price)}
              </TableCell>
              <TableCell className="text-right">{item.stock}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleOpenEditDialog(item)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setItemToDelete(item)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Barang Saya</CardTitle>
            <CardDescription>
              Semua barang yang sudah kamu tambahkan akan muncul di sini.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={handleOpenCreateDialog}>
            <PlusCircle className="w-4 h-4" />
            Tambah Barang
          </Button>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>

      {totalPages > 1 && (
        <Pagination className="py-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 py-2 text-sm font-medium">
                Halaman {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ItemFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        item={editingItem}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Benar-Benar Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus barang
              <span className="font-bold"> {itemToDelete?.name} </span>
              secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
