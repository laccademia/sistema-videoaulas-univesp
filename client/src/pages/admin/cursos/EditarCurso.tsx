import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const EIXOS = [
  "Computação e Tecnologia da Informação",
  "Negócios e Produção",
  "Humanas e Educação"
];

export default function EditarCurso() {
  const [, params] = useRoute("/admin/cursos/:id/editar");
  const [, setLocation] = useLocation();
  const cursoId = params?.id ? parseInt(params.id) : 0;

  const [eixo, setEixo] = useState("");
  const [nome, setNome] = useState("");

  const { data: curso, isLoading } = trpc.admin.cursos.getById.useQuery(
    { id: cursoId },
    { enabled: cursoId > 0 }
  );

  const updateMutation = trpc.admin.cursos.update.useMutation({
    onSuccess: () => {
      toast.success("Curso atualizado com sucesso!");
      setLocation("/admin/cursos");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  useEffect(() => {
    if (curso) {
      setEixo(curso.eixo);
      setNome(curso.nome);
    }
  }, [curso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eixo) {
      toast.error("Selecione o eixo do curso");
      return;
    }
    
    if (!nome.trim()) {
      toast.error("Preencha o nome do curso");
      return;
    }

    updateMutation.mutate({
      id: cursoId,
      eixo,
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

  if (!curso) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Curso não encontrado</div>
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
            onClick={() => setLocation("/admin/cursos")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Curso</h1>
            <p className="text-muted-foreground">Atualizar dados do curso</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
              <CardDescription>Atualize os dados do curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eixo">Eixo *</Label>
                <Select value={eixo} onValueChange={setEixo}>
                  <SelectTrigger id="eixo">
                    <SelectValue placeholder="Selecione o eixo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EIXOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Curso *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Bacharelado em Ciência de Dados"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/cursos")}
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
