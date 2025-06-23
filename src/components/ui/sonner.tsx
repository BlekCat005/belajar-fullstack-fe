"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Gaya dasar untuk semua toast
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          // ==================================================
          // Perubahan: Tambahkan gaya khusus untuk setiap tipe
          // ==================================================
          success: "group-[.toast]:border-green-500",
          error: "group-[.toast]:border-destructive",
          warning: "group-[.toast]:border-yellow-500",
          info: "group-[.toast]:border-blue-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
