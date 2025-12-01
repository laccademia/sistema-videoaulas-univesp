import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export default function DesignersAdmin() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [designerParaExcluir, setDesignerParaExcluir] = useState<number | null>(null);

  const { data: designers, isLoading, refetch } = trpc.dis.list.useQuery();

  const deleteMutation = trpc.admin.designers.delete.useMutation({
    onSuccess: () => {
      toast.success("Designer Instrucional excluído com sucesso!");
      refetch();
      setDesignerParaExcluir(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const designersFiltrados = designers?.filter((d: any) =>
    d.nome.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Designers Instrucionais</h1>
            <p className="text-muted-foreground">Gerenciar designers instrucionais do sistema</p>
          </div>
          <Button onClick={() => setLocation("/admin/designers/novo")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Designer
          </Button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {designersFiltrados.length} designer(s) encontrado(s)
          </div>
        </div>

        {/* Tabela */}
        {isLoading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designersFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum designer encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  designersFiltrados.map((designer: any) => (
                    <TableRow key={designer.id}>
                      <TableCell className="font-mono">{designer.id}</TableCell>
                      <TableCell className="font-medium">{designer.nome}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLocation(`/admin/designers/${designer.id}/editar`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDesignerParaExcluir(designer.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={designerParaExcluir !== null} onOpenChange={() => setDesignerParaExcluir(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este designer instrucional? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => designerParaExcluir && deleteMutation.mutate({ id: designerParaExcluir })}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
