import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen, Loader2, Clock, GraduationCap, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function Disciplinas() {
  const { data: disciplinas, isLoading } = trpc.disciplinas.listComCurso.useQuery();
  const [eixoSelecionado, setEixoSelecionado] = useState<string>("todos");
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("todos");

  // Extrair eixos únicos
  const eixos = useMemo(() => {
    if (!disciplinas) return [];
    const eixosSet = new Set(disciplinas.map(item => item.curso?.eixo).filter(Boolean));
    return Array.from(eixosSet).sort();
  }, [disciplinas]);

  // Extrair cursos do eixo selecionado
  const cursos = useMemo(() => {
    if (!disciplinas) return [];
    const disciplinasFiltradas = eixoSelecionado === "todos" 
      ? disciplinas 
      : disciplinas.filter(item => item.curso?.eixo === eixoSelecionado);
    
    const cursosSet = new Set(disciplinasFiltradas.map(item => item.curso?.nome).filter(Boolean));
    return Array.from(cursosSet).sort();
  }, [disciplinas, eixoSelecionado]);

  // Filtrar disciplinas
  const disciplinasFiltradas = useMemo(() => {
    if (!disciplinas) return [];
    
    return disciplinas.filter(item => {
      const matchEixo = eixoSelecionado === "todos" || item.curso?.eixo === eixoSelecionado;
      const matchCurso = cursoSelecionado === "todos" || item.curso?.nome === cursoSelecionado;
      return matchEixo && matchCurso;
    });
  }, [disciplinas, eixoSelecionado, cursoSelecionado]);

  // Resetar curso quando eixo muda
  const handleEixoChange = (value: string) => {
    setEixoSelecionado(value);
    setCursoSelecionado("todos");
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Disciplinas</h1>
          <p className="text-muted-foreground">
            Navegue pelas disciplinas oferecidas nos cursos da Univesp.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar por Eixo
            </label>
            <Select value={eixoSelecionado} onValueChange={handleEixoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um eixo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Eixos</SelectItem>
                {eixos.map((eixo) => (
                  <SelectItem key={eixo} value={eixo!}>
                    {eixo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Filtrar por Curso
            </label>
            <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cursos</SelectItem>
                {cursos.map((curso) => (
                  <SelectItem key={curso} value={curso!}>
                    {curso}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Breadcrumb informativo */}
        {(eixoSelecionado !== "todos" || cursoSelecionado !== "todos") && (
          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Navegação:</span>
            {eixoSelecionado !== "todos" && (
              <>
                <Badge variant="secondary">{eixoSelecionado}</Badge>
                {cursoSelecionado !== "todos" && <span className="text-muted-foreground">→</span>}
              </>
            )}
            {cursoSelecionado !== "todos" && (
              <Badge variant="default">{cursoSelecionado}</Badge>
            )}
            <span className="text-muted-foreground ml-2">
              ({disciplinasFiltradas.length} {disciplinasFiltradas.length === 1 ? 'disciplina' : 'disciplinas'})
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplinasFiltradas?.map((item) => (
              <Card key={item.disciplina.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {item.disciplina.codigo}
                    </span>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{item.disciplina.nome}</CardTitle>
                  <CardDescription className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{item.curso?.nome}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Eixo: {item.curso?.eixo}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{item.disciplina.cargaHoraria}h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && disciplinasFiltradas.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Nenhuma disciplina encontrada</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros para ver mais resultados.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
