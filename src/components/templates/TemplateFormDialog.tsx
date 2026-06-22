import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { Brand } from "@/lib/types";

export function TemplateFormDialog() {
  const { addTemplate } = useStore();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState<Brand>("Renault");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Başlık ve mesaj zorunludur");
      return;
    }
    addTemplate({ brand, title: title.trim(), body: body.trim() });
    toast.success("Şablon eklendi");
    setOpen(false);
    setTitle("");
    setBody("");
    setBrand("Renault");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Şablon Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Şablon</DialogTitle>
          <DialogDescription>
            Marka, başlık ve mesaj gövdesini girin. Parametre için <code>[##Ad##]</code> sözdizimini
            kullanın.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Marka</Label>
            <Select value={brand} onValueChange={(v) => setBrand(v as Brand)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Renault">Renault</SelectItem>
                <SelectItem value="Dacia">Dacia</SelectItem>
                <SelectItem value="Alpine">Alpine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Başlık</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Servis Hatırlatma" />
          </div>
          <div className="grid gap-2">
            <Label>Mesaj Gövdesi</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Sayın [##Ad##], ..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={submit}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
