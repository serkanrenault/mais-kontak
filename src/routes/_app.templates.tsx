import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { TemplateFormDialog } from "@/components/templates/TemplateFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/templates")({
  head: () => ({ meta: [{ title: "Şablonlar — Mais Kontak" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { templates, removeTemplate } = useStore();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Şablon Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            Önceden tanımlı mesaj şablonlarını yönetin.
          </p>
        </div>
        <TemplateFormDialog />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Marka</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Gövde</TableHead>
                <TableHead className="w-32">Oluşturulma</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                      {t.brand}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {t.body}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Sil">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Şablonu silmek istediğinize emin misiniz?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            “{t.title}” şablonu silinecek. Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => removeTemplate(t.id)}
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Henüz şablon yok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
