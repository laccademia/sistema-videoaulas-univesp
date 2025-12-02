import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarVideoaula() {
  const [, params] = useRoute("/admin/videoaulas/:id/editar");
  const [, setLocation] = useLocation();
  const videoaulaId = params?.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    semana: "1",
    numeroAula: "1",
    titulo: "",
    sinopse: "",
    linkYoutubeOriginal: "",
    slidesDisponivel: false,
    status: "",
    idTvCultura: "",
    duracaoMinutos: "",
    linkLibras: "",
    linkAudiodescricao: "",
    ccLegenda: false,
    linkDownload: "",
  });

  const { data: videoaulaData, isLoading } = trpc.videoaulas.getById.useQuery(
    { id: videoaulaId! },
    { enabled: !!videoaulaId }
  );

  const utils = trpc.useUtils();

  const updateMutation = trpc.admin.videoaulas.update.useMutation({
    onSuccess: () => {
      utils.videoaulas.list.invalidate();
      utils.videoaulas.getById.invalidate({ id: videoaulaId! });
      toast.success("Videoaula atualizada com sucesso!");
      setLocation("/admin/videoaulas");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  // Preencher formulário quando dados carregarem
  useEffect(() => {
    if (videoaulaData?.videoaula) {
      const v = videoaulaData.videoaula;
      setFormData({
        semana: v.semana.toString(),
        numeroAula: v.numeroAula.toString(),
        titulo: v.titulo,
        sinopse: v.sinopse || "",
        linkYoutubeOriginal: v.linkYoutubeOriginal || "",
        slidesDisponivel: v.slidesDisponivel,
        status: v.status || "",
        idTvCultura: v.idTvCultura || "",
        duracaoMinutos: v.duracaoMinutos?.toString() || "",
        linkLibras: v.linkLibras || "",
        linkAudiodescricao: v.linkAudiodescricao || "",
        ccLegenda: v.ccLegenda,
        linkDownload: v.linkDownload || "",
      });
    }
  }, [videoaulaData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoaulaId || !formData.titulo) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    updateMutation.mutate({
      id: videoaulaId,
      semana: parseInt(formData.semana) || 0,
      numeroAula: parseInt(formData.numeroAula) || 0,
      titulo: formData.titulo,
      sinopse: formData.sinopse || undefined,
      linkYoutubeOriginal: formData.linkYoutubeOriginal || undefined,
      slidesDisponivel: formData.slidesDisponivel,
      status: formData.status || undefined,
      idTvCultura: formData.idTvCultura || undefined,
      duracaoMinutos: formData.duracaoMinutos ? parseInt(formData.duracaoMinutos) : undefined,
      linkLibras: formData.linkLibras || undefined,
      linkAudiodescricao: formData.linkAudiodescricao || undefined,
      ccLegenda: formData.ccLegenda,
      linkDownload: formData.linkDownload || undefined,
    });
  };

  if (!videoaulaId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">ID da videoaula inválido</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!videoaulaData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Videoaula não encontrada</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/videoaulas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Videoaula</h1>
            <p className="text-muted-foreground">
              {videoaulaData.disciplina?.codigo} - {videoaulaData.disciplina?.nome}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Ano: {videoaulaData.oferta?.ano} | Bimestre: {videoaulaData.oferta?.bimestreOperacional}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semana">Semana *</Label>
                  <Input
                    id="semana"
                    type="number"
                    min="0"
                    value={formData.semana}
                    onChange={(e) =>
                      setFormData({ ...formData, semana: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroAula">Número da Aula *</Label>
                  <Input
                    id="numeroAula"
                    type="number"
                    min="0"
                    value={formData.numeroAula}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroAula: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (min)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    value={formData.duracaoMinutos}
                    onChange={(e) =>
                      setFormData({ ...formData, duracaoMinutos: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Digite o título da videoaula"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sinopse">Sinopse</Label>
                <Textarea
                  id="sinopse"
                  value={formData.sinopse}
                  onChange={(e) =>
                    setFormData({ ...formData, sinopse: e.target.value })
                  }
                  placeholder="Descrição breve do conteúdo da videoaula"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipe */}
          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>
                Professor: {videoaulaData.professor?.nome || "Não informado"} | 
                Designer: {videoaulaData.di?.nome || "Não informado"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Para alterar professor ou designer, é necessário editar a oferta da disciplina.
              </p>
            </CardContent>
          </Card>

          {/* Links e Recursos */}
          <Card>
            <CardHeader>
              <CardTitle>Links e Recursos</CardTitle>
              <CardDescription>URLs e identificadores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idTvCultura">ID TV Cultura</Label>
                  <Input
                    id="idTvCultura"
                    value={formData.idTvCultura}
                    onChange={(e) =>
                      setFormData({ ...formData, idTvCultura: e.target.value })
                    }
                    placeholder="Ex: 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    placeholder="Ex: Publicado"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">Link YouTube Original</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={formData.linkYoutubeOriginal}
                  onChange={(e) =>
                    setFormData({ ...formData, linkYoutubeOriginal: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="download">Link Download</Label>
                <Input
                  id="download"
                  type="url"
                  value={formData.linkDownload}
                  onChange={(e) =>
                    setFormData({ ...formData, linkDownload: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Acessibilidade */}
          <Card>
            <CardHeader>
              <CardTitle>Acessibilidade</CardTitle>
              <CardDescription>Recursos de acessibilidade disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="libras">Link Libras</Label>
                <Input
                  id="libras"
                  type="url"
                  value={formData.linkLibras}
                  onChange={(e) =>
                    setFormData({ ...formData, linkLibras: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audiodescricao">Link Audiodescrição</Label>
                <Input
                  id="audiodescricao"
                  type="url"
                  value={formData.linkAudiodescricao}
                  onChange={(e) =>
                    setFormData({ ...formData, linkAudiodescricao: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ccLegenda"
                  checked={formData.ccLegenda}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ccLegenda: checked as boolean })
                  }
                />
                <Label htmlFor="ccLegenda" className="cursor-pointer">
                  Closed Caption (CC) disponível
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slides"
                  checked={formData.slidesDisponivel}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, slidesDisponivel: checked as boolean })
                  }
                />
                <Label htmlFor="slides" className="cursor-pointer">
                  Slides disponíveis
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/videoaulas")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
