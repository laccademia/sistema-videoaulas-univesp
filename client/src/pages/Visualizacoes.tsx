import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useMemo } from "react";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  libras: "#3b82f6",
  audiodescricao: "#10b981",
  cc: "#f59e0b",
  semAcessibilidade: "#6b7280",
};

export default function Visualizacoes() {
  const { data: videoaulas, isLoading } = trpc.videoaulas.list.useQuery({
    limit: 10000,
  });

  // Processar dados para gráficos
  const chartsData = useMemo(() => {
    if (!videoaulas?.items) return null;

    // 1. Distribuição por ano
    const porAno: Record<number, number> = {};
    videoaulas.items.forEach(item => {
      const ano = item.oferta?.ano;
      if (ano) {
        porAno[ano] = (porAno[ano] || 0) + 1;
      }
    });
    const distribuicaoPorAno = Object.entries(porAno)
      .map(([ano, total]) => ({ ano: parseInt(ano), total }))
      .sort((a, b) => a.ano - b.ano);

    // 2. Cobertura de acessibilidade
    const totalVideoaulas = videoaulas.items.length;
    const comLibras = videoaulas.items.filter(v => v.videoaula.linkLibras).length;
    const comAudiodescricao = videoaulas.items.filter(v => v.videoaula.linkAudiodescricao).length;
    const comCC = videoaulas.items.filter(v => v.videoaula.ccLegenda).length;
    const semAcessibilidade = videoaulas.items.filter(v => 
      !v.videoaula.linkLibras && 
      !v.videoaula.linkAudiodescricao && 
      !v.videoaula.ccLegenda
    ).length;

    const coberturaAcessibilidade = [
      { name: "Com Libras", value: comLibras, color: COLORS.libras },
      { name: "Com Audiodescrição", value: comAudiodescricao, color: COLORS.audiodescricao },
      { name: "Com CC", value: comCC, color: COLORS.cc },
      { name: "Sem Acessibilidade", value: semAcessibilidade, color: COLORS.semAcessibilidade },
    ];

    // 3. Videoaulas por ano e bimestre
    const porAnoBimestre: Record<number, Record<number, number>> = {};
    videoaulas.items.forEach(item => {
      const ano = item.oferta?.ano;
      const bimestre = item.oferta?.bimestreOperacional;
      if (ano && bimestre) {
        if (!porAnoBimestre[ano]) porAnoBimestre[ano] = {};
        porAnoBimestre[ano][bimestre] = (porAnoBimestre[ano][bimestre] || 0) + 1;
      }
    });

    const distribuicaoPorAnoBimestre = Object.entries(porAnoBimestre)
      .map(([ano, bimestres]) => ({
        ano: parseInt(ano),
        "Bimestre 1": bimestres[1] || 0,
        "Bimestre 2": bimestres[2] || 0,
        "Bimestre 3": bimestres[3] || 0,
        "Bimestre 4": bimestres[4] || 0,
      }))
      .sort((a, b) => a.ano - b.ano);

    // 4. Evolução temporal (acumulado)
    let acumulado = 0;
    const evolucaoTemporal = distribuicaoPorAno.map(item => {
      acumulado += item.total;
      return {
        ano: item.ano,
        total: item.total,
        acumulado,
      };
    });

    return {
      distribuicaoPorAno,
      coberturaAcessibilidade,
      distribuicaoPorAnoBimestre,
      evolucaoTemporal,
      totalVideoaulas,
    };
  }, [videoaulas?.items]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chartsData) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Nenhum dado disponível para visualização.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Visualizações e Análises</h1>
        <p className="text-muted-foreground">
          Gráficos interativos para análise da distribuição e cobertura de videoaulas.
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Videoaulas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartsData.totalVideoaulas}</div>
            <p className="text-xs text-muted-foreground">
              Distribuídas em {chartsData.distribuicaoPorAno.length} anos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Libras</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartsData.coberturaAcessibilidade[0].value}
            </div>
            <p className="text-xs text-muted-foreground">
              {((chartsData.coberturaAcessibilidade[0].value / chartsData.totalVideoaulas) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Audiodescrição</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartsData.coberturaAcessibilidade[1].value}
            </div>
            <p className="text-xs text-muted-foreground">
              {((chartsData.coberturaAcessibilidade[1].value / chartsData.totalVideoaulas) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Legendas (CC)</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartsData.coberturaAcessibilidade[2].value}
            </div>
            <p className="text-xs text-muted-foreground">
              {((chartsData.coberturaAcessibilidade[2].value / chartsData.totalVideoaulas) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Distribuição por Ano */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Ano
            </CardTitle>
            <CardDescription>
              Quantidade de videoaulas produzidas por ano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.distribuicaoPorAno}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="ano" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="total" name="Videoaulas" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cobertura de Acessibilidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cobertura de Acessibilidade
            </CardTitle>
            <CardDescription>
              Distribuição de recursos de acessibilidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={chartsData.coberturaAcessibilidade}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartsData.coberturaAcessibilidade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução Temporal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução Temporal
            </CardTitle>
            <CardDescription>
              Crescimento acumulado de videoaulas ao longo dos anos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData.evolucaoTemporal}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="ano" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="acumulado" 
                  name="Total Acumulado" 
                  stroke={COLORS.primary} 
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Ano e Bimestre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribuição por Ano e Bimestre
            </CardTitle>
            <CardDescription>
              Videoaulas organizadas por bimestre operacional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.distribuicaoPorAnoBimestre}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="ano" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="Bimestre 1" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Bimestre 2" stackId="a" fill="#10b981" />
                <Bar dataKey="Bimestre 3" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Bimestre 4" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
