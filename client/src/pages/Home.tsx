import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery();
  const { data: porCurso } = trpc.stats.porCurso.useQuery();
  const { data: porAno } = trpc.stats.porAno.useQuery();

  // Mapeamento de cores específicas por curso usando variáveis CSS
  const cursoColors: Record<string, string> = {
    'Administração': 'var(--neon-cyan)',
    'Ciência de Dados': 'var(--neon-purple)',
    'Eng. Computação': 'var(--neon-green)',
    'Tec. Informação': 'var(--neon-magenta)',
    'Eng. Produção': 'var(--neon-orange)',
    'Letras': 'var(--neon-yellow)',
    'Matemática': 'var(--neon-lime)',
    'Pedagogia': 'var(--neon-blue)',
    'Processos Gerenciais': 'var(--neon-red)',
  };

  return (
    <Layout>
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Visão geral do sistema de videoaulas</p>
          </div>

          {/* Main Metrics Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} style={{ backgroundColor: 'var(--bg-card)' }}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,194,255,0.5)]" 
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  border: '2px solid var(--neon-cyan)'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Videoaulas
                  </CardTitle>
                  <Video className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--neon-cyan)' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: 'var(--neon-cyan)' }}>{stats?.totalVideoaulas || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(157,0,255,0.5)]" 
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  border: '2px solid var(--neon-purple)'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Disciplinas
                  </CardTitle>
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--neon-purple)' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: 'var(--neon-purple)' }}>{stats?.totalDisciplinas || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,255,85,0.5)]" 
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  border: '2px solid var(--neon-green)'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Cursos
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--neon-green)' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: 'var(--neon-green)' }}>{stats?.totalCursos || 0}</div>
                </CardContent>
              </Card>

              <Card 
                className="transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,0,199,0.5)]" 
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  border: '2px solid var(--neon-magenta)'
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Professores
                  </CardTitle>
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--neon-magenta)' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold" style={{ color: 'var(--neon-magenta)' }}>{stats?.totalProfessores || 0}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras Horizontais - Distribuição por Curso */}
            <Card style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <PieChartIcon className="h-5 w-5" style={{ color: 'var(--neon-cyan)' }} />
                  Distribuição de Videoaulas por Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porCurso && porCurso.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                      data={porCurso.map(c => ({ 
                        nome: c.curso.nome.replace('Bacharelado em ', '').replace('Tecnologia em ', 'Tec. '),
                        total: c.total 
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        type="number"
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="nome"
                        stroke="#E0E0E0"
                        style={{ fontSize: '11px' }}
                        tick={{ fill: '#E0E0E0' }}
                        width={110}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                      >
                        {porCurso.map((entry, index) => {
                          const nomeSimplificado = entry.curso.nome.replace('Bacharelado em ', '').replace('Tecnologia em ', 'Tec. ');
                          const color = cursoColors[nomeSimplificado] || 'var(--neon-cyan)';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={color}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Área com Gradiente - Evolução Temporal */}
            <Card style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <TrendingUp className="h-5 w-5" style={{ color: 'var(--neon-cyan)' }} />
                  Evolução Temporal de Videoaulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {porAno && porAno.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart 
                      data={porAno}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity={0.8}/>
                          <stop offset="50%" stopColor="var(--neon-purple)" stopOpacity={0.6}/>
                          <stop offset="100%" stopColor="var(--neon-magenta)" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="ano"
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <YAxis
                        stroke="#E0E0E0"
                        style={{ fontSize: '12px' }}
                        tick={{ fill: '#E0E0E0' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="var(--neon-cyan)"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-8">Sem dados disponíveis</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
