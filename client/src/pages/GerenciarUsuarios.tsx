import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Clock, Users as UsersIcon, Mail, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GerenciarUsuarios() {

  const utils = trpc.useUtils();
  
  const { data: pendingUsers, isLoading: loadingPending } = trpc.users.listPending.useQuery();
  const { data: allUsers, isLoading: loadingAll } = trpc.users.list.useQuery();
  
  const approveMutation = trpc.users.approve.useMutation({
    onSuccess: () => {
      alert("✅ Usuário aprovado com sucesso!");
      utils.users.listPending.invalidate();
      utils.users.list.invalidate();
    },
    onError: (error) => {
      alert(`❌ Erro ao aprovar: ${error.message}`);
    },
  });

  const rejectMutation = trpc.users.reject.useMutation({
    onSuccess: () => {
      alert("❌ Usuário rejeitado.");
      utils.users.listPending.invalidate();
      utils.users.list.invalidate();
    },
    onError: (error) => {
      alert(`❌ Erro ao rejeitar: ${error.message}`);
    },
  });

  const changeRoleMutation = trpc.users.changeRole.useMutation({
    onSuccess: () => {
      alert("✅ Permissão alterada com sucesso!");
      utils.users.list.invalidate();
    },
    onError: (error) => {
      alert(`❌ Erro ao alterar permissão: ${error.message}`);
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" style={{ borderColor: '#FFE600', color: '#FFE600' }}>
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>;
      case 'approved':
        return <Badge variant="outline" style={{ borderColor: '#00FF55', color: '#00FF55' }}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" style={{ borderColor: '#FF3333', color: '#FF3333' }}>
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge variant="outline" style={{ borderColor: '#9D00FF', color: '#9D00FF' }}>
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline" style={{ borderColor: '#00C2FF', color: '#00C2FF' }}>
        Usuário
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen py-8" style={{ backgroundColor: '#0A101F' }}>
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
            <p className="text-gray-400">Aprovar ou rejeitar solicitações de acesso</p>
          </div>

          {/* Solicitações Pendentes */}
          <Card 
            className="mb-8"
            style={{ 
              backgroundColor: '#141C2F',
              border: '2px solid #FFE600'
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" style={{ color: '#FFE600' }} />
                Solicitações Pendentes
                {pendingUsers && pendingUsers.length > 0 && (
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: '#FFE600', 
                      color: '#FFE600',
                      marginLeft: '8px'
                    }}
                  >
                    {pendingUsers.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Usuários aguardando aprovação para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPending ? (
                <div className="text-center text-gray-400 py-8">Carregando...</div>
              ) : pendingUsers && pendingUsers.length > 0 ? (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: 'rgba(255, 230, 0, 0.05)',
                        borderColor: 'rgba(255, 230, 0, 0.3)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {user.name || 'Nome não disponível'}
                            </h3>
                            {getStatusBadge(user.status)}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-400">
                            {user.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Solicitado em {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => approveMutation.mutate({ userId: user.id })}
                            disabled={approveMutation.isPending}
                            style={{ 
                              backgroundColor: '#00FF55',
                              color: '#0A101F'
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button
                            onClick={() => rejectMutation.mutate({ userId: user.id })}
                            disabled={rejectMutation.isPending}
                            variant="outline"
                            style={{ 
                              borderColor: '#FF3333',
                              color: '#FF3333'
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Nenhuma solicitação pendente
                </div>
              )}
            </CardContent>
          </Card>

          {/* Todos os Usuários */}
          <Card style={{ backgroundColor: '#141C2F', border: '1px solid rgba(255,255,255,0.1)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UsersIcon className="h-5 w-5" style={{ color: '#00C2FF' }} />
                Todos os Usuários
              </CardTitle>
              <CardDescription className="text-gray-400">
                Lista completa de usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAll ? (
                <div className="text-center text-gray-400 py-8">Carregando...</div>
              ) : allUsers && allUsers.length > 0 ? (
                <div className="rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <TableHead className="text-gray-400">Nome</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Permissão</TableHead>
                        <TableHead className="text-gray-400">Cadastro</TableHead>
                        <TableHead className="text-gray-400">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <TableCell className="text-white font-medium">
                            {user.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {user.email || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(user.role)}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell>
                            {user.status === 'approved' && (
                              <Button
                                onClick={() => changeRoleMutation.mutate({
                                  userId: user.id,
                                  role: user.role === 'admin' ? 'user' : 'admin'
                                })}
                                disabled={changeRoleMutation.isPending}
                                variant="outline"
                                size="sm"
                                style={{ 
                                  borderColor: '#9D00FF',
                                  color: '#9D00FF'
                                }}
                              >
                                {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Nenhum usuário encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
