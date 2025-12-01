import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Video, BookOpen, GraduationCap, Users, TrendingUp, Eye, Subtitles, Volume2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading } = trpc.stats.overview.useQuery();
  const { data: acessibilidade } = trpc.stats.acessibilidade.useQuery();

  return (
    <Layout>
      {/* Hero Section with Neon Gradient */}
      <section className="relative overflow-hidden gradient-neon-hero py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_50%)]"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Logo Univesp com efeito neon */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-green)] opacity-30 animate-pulse"></div>
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 neon-border-cyan">
                <Video className="h-16 w-16 text-[var(--neon-cyan)] mx-auto" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6">
              <span className="neon-text-cyan">Sistema de Videoaulas</span>
              <br />
              <span className="neon-text-purple">Univesp</span>
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl">
              Plataforma completa para gestão, visualização e análise das videoaulas produzidas pela Univesp. 
              Explore nosso acervo de conteúdos educacionais de qualidade.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/videoaulas">
                <Button size="lg" className="gap-2 neon-glow-cyan hover:scale-105 transition-transform">
                  <Video className="h-5 w-5" />
                  Explorar Videoaulas
                </Button>
              </Link>
              <Link href="/estatisticas">
                <Button size="lg" variant="outline" className="gap-2 neon-border-purple hover:neon-glow-purple transition-all">
                  <TrendingUp className="h-5 w-5" />
                  Ver Estatísticas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Neon Cards */}
      <section className="py-20 gradient-neon-bg">
        <div className="container">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="h-8 w-8 text-[var(--neon-cyan)]" />
            <h2 className="text-4xl font-bold text-center neon-text-cyan">Visão Geral do Sistema</h2>
            <Sparkles className="h-8 w-8 text-[var(--neon-purple)]" />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Videoaulas
                  </CardTitle>
                  <Video className="h-5 w-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-text-cyan">{stats?.totalVideoaulas || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conteúdos disponíveis
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Disciplinas
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-[var(--neon-purple)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-text-purple">{stats?.totalDisciplinas || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Áreas de conhecimento
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-green hover:neon-glow-green transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cursos
                  </CardTitle>
                  <GraduationCap className="h-5 w-5 text-[var(--neon-green)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-text-green">{stats?.totalCursos || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Graduações oferecidas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Professores
                  </CardTitle>
                  <Users className="h-5 w-5 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-text-cyan">{stats?.totalProfessores || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Educadores envolvidos
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Acessibilidade Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <h2 className="text-4xl font-bold mb-4 text-center neon-text-purple">Recursos de Acessibilidade</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
            Nosso compromisso com a inclusão: videoaulas com recursos de acessibilidade para todos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center bg-card/50 backdrop-blur-sm neon-border-cyan hover:neon-glow-cyan transition-all duration-300 group">
              <CardHeader>
                <div className="mx-auto h-16 w-16 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="h-8 w-8 text-[var(--neon-cyan)]" />
                </div>
                <CardTitle className="text-xl">Libras</CardTitle>
                <CardDescription>Tradução em Língua de Sinais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold neon-text-cyan mb-2">
                  {acessibilidade?.comLibras || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card/50 backdrop-blur-sm neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
              <CardHeader>
                <div className="mx-auto h-16 w-16 rounded-full bg-[var(--neon-purple)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Volume2 className="h-8 w-8 text-[var(--neon-purple)]" />
                </div>
                <CardTitle className="text-xl">Audiodescrição</CardTitle>
                <CardDescription>Narração descritiva</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold neon-text-purple mb-2">
                  {acessibilidade?.comAudiodescricao || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-card/50 backdrop-blur-sm neon-border-green hover:neon-glow-green transition-all duration-300 group">
              <CardHeader>
                <div className="mx-auto h-16 w-16 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Subtitles className="h-8 w-8 text-[var(--neon-green)]" />
                </div>
                <CardTitle className="text-xl">Legendas (CC)</CardTitle>
                <CardDescription>Closed Captions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold neon-text-green mb-2">
                  {acessibilidade?.comCC || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  videoaulas disponíveis
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section with Neon Gradient */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)]/20 via-[var(--neon-purple)]/20 to-[var(--neon-green)]/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.15),transparent_70%)]"></div>
        <div className="container relative z-10 text-center">
          <h2 className="text-5xl font-bold mb-6 neon-text-cyan">Pronto para explorar?</h2>
          <p className="text-lg mb-10 text-foreground/80 max-w-2xl mx-auto">
            Navegue por nosso extenso catálogo de videoaulas, filtre por curso, disciplina ou professor, 
            e aproveite conteúdos de qualidade com recursos de acessibilidade.
          </p>
          <Link href="/videoaulas">
            <Button size="lg" className="gap-2 neon-glow-purple hover:scale-105 transition-transform text-lg px-8 py-6">
              <Video className="h-6 w-6" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
