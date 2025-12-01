import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarDesigner() {
  const [, params] = useRoute("/admin/designers/:id/editar");
  const [, setLocation] = useLocation();
  const designerId = params?.id ? parseInt(params.id) : 0;

  const [nome, setNome] = useState("");

  const { data: designer, isLoading } = trpc.admin.designers.getById.useQuery(
    { id: designerId },
    { enabled: designerId > 0 }
  );

  const updateMutation = trpc.admin.designers.update.useMutation({
    onSuccess: () => {
      toast.success("Designer Instrucional atualizado com sucesso!");
      setLocation("/admin/designers");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  useEffect(() => {
    if (designer) {
      setNome(designer.nome);
    }
  }, [designer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Preencha o nome do designer instrucional");
      return;
    }

    updateMutation.mutate({
      id: designerId,
      nome: nome.trim(),
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }

  if (!designer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Designer Instrucional não encontrado</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/designers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Designer Instrucional</h1>
            <p className="text-muted-foreground">Atualizar dados do designer instrucional</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Designer</CardTitle>
              <CardDescription>Atualize os dados do designer instrucional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria dos Santos"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/designers")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
