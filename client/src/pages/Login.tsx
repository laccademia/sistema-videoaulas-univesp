import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Video } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    // Redirecionar para OAuth do Manus
    window.location.href = "/api/oauth/login";
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0A101F' }}
    >
      <Card 
        className="w-full max-w-md neon-card-cyan rounded-xl"
        style={{ backgroundColor: '#141C2F' }}
      >
        <CardHeader className="text-center space-y-6 pt-8">
          {/* Logo Univesp */}
          <div className="flex justify-center">
            <img 
              src="/univesp-logo.png" 
              alt="Univesp Logo" 
              className="h-24 w-auto"
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Video className="h-8 w-8" style={{ color: '#00C2FF' }} />
              Sistema de Videoaulas
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Universidade Virtual do Estado de São Paulo
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="text-center text-gray-300 text-sm space-y-2">
            <p>
              Bem-vindo ao sistema de gerenciamento de videoaulas da Univesp.
            </p>
            <p>
              Faça login para acessar o conteúdo educacional.
            </p>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full h-12 text-lg font-semibold"
            style={{
              backgroundColor: '#00C2FF',
              color: '#0A101F',
              border: '2px solid #00C2FF',
              boxShadow: '0 0 20px rgba(0, 194, 255, 0.4)',
            }}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Entrar com Manus
          </Button>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Ao fazer login, você concorda com os termos de uso.</p>
            <p>Novos usuários terão acesso de visualização.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
