import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, LogIn, AlertCircle } from "lucide-react";
import { getLoginUrl } from "@/lib/trpc";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Se o usuário já está logado e aprovado, redireciona para home
    if (user && user.status === "approved") {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A101F' }}>
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  // Se usuário está pendente, mostra mensagem de aguardando aprovação
  if (user && user.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0A101F' }}>
        <Card 
          className="w-full max-w-md"
          style={{ 
            backgroundColor: '#141C2F',
            border: '2px solid #FFE600'
          }}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255, 230, 0, 0.2)' }}
              >
                <AlertCircle className="h-8 w-8" style={{ color: '#FFE600' }} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Aguardando Aprovação
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Seu acesso está sendo analisado
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">
              Olá, <span className="font-semibold" style={{ color: '#FFE600' }}>{user.name}</span>!
            </p>
            <p className="text-gray-400 mb-4">
              Sua solicitação de acesso foi enviada para análise. 
              Você receberá uma notificação assim que seu acesso for aprovado.
            </p>
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 230, 0, 0.1)' }}>
              <p className="text-sm text-gray-400">
                Tempo médio de aprovação: <span className="font-semibold text-white">24-48 horas</span>
              </p>
            </div>
            <Button
              onClick={() => {
                // Logout
                window.location.href = "/api/oauth/logout";
              }}
              variant="outline"
              className="mt-6 w-full"
              style={{ borderColor: '#FFE600', color: '#FFE600' }}
            >
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se usuário foi rejeitado, mostra mensagem de acesso negado
  if (user && user.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0A101F' }}>
        <Card 
          className="w-full max-w-md"
          style={{ 
            backgroundColor: '#141C2F',
            border: '2px solid #FF3333'
          }}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255, 51, 51, 0.2)' }}
              >
                <AlertCircle className="h-8 w-8" style={{ color: '#FF3333' }} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Sua solicitação foi recusada
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-6">
              Infelizmente, sua solicitação de acesso ao sistema não foi aprovada.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Se você acredita que isso é um erro, entre em contato com o administrador do sistema.
            </p>
            <Button
              onClick={() => {
                // Logout
                window.location.href = "/api/oauth/logout";
              }}
              variant="outline"
              className="mt-6 w-full"
              style={{ borderColor: '#FF3333', color: '#FF3333' }}
            >
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Página de login padrão
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0A101F' }}>
      <Card 
        className="w-full max-w-md"
        style={{ 
          backgroundColor: '#141C2F',
          border: '2px solid #00C2FF'
        }}
      >
        <CardHeader className="text-center">
          {/* Logo Univesp */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(0, 194, 255, 0.2)',
                  border: '2px solid #00C2FF'
                }}
              >
                <Video className="h-8 w-8" style={{ color: '#00C2FF' }} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold leading-none" style={{ color: '#00C2FF' }}>
                  Videoaulas
                </span>
                <span className="text-sm" style={{ color: '#9D00FF' }}>
                  Univesp
                </span>
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-white">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Sistema de Gestão de Videoaulas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 194, 255, 0.1)' }}>
              <p className="text-sm text-gray-300 text-center">
                Faça login para acessar o sistema de videoaulas da Univesp
              </p>
            </div>

            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="w-full h-12 text-base font-semibold transition-all"
              style={{ 
                backgroundColor: '#00C2FF',
                color: '#0A101F'
              }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Entrar com Manus
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Ao fazer login, você concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
