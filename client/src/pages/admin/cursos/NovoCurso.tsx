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
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const EIXOS = [
  "Computação e Tecnologia da Informação",
  "Negócios e Produção",
  "Humanas e Educação"
];

export default function NovoCurso() {
  const [, setLocation] = useLocation();
  const [eixo, setEixo] = useState("");
  const [nome, setNome] = useState("");

  const createMutation = trpc.admin.cursos.create.useMutation({
    onSuccess: () => {
      toast.success("Curso criado com sucesso!");
      setLocation("/admin/cursos");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar: ${error.message}`);
    },
  });

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

    createMutation.mutate({
      eixo,
      nome: nome.trim(),
    });
  };

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
            <h1 className="text-3xl font-bold">Novo Curso</h1>
            <p className="text-muted-foreground">Cadastrar novo curso no sistema</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
              <CardDescription>Preencha os dados do curso</CardDescription>
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
                <Button type="submit" disabled={createMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? "Salvando..." : "Salvar Curso"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
