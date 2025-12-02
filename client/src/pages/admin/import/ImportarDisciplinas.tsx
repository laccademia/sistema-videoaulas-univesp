import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Upload, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";

type PreviewRow = {
  codigo: string;
  nome: string;
  cursos?: number[];
};

type ImportResult = {
  codigo: string;
  status: 'success' | 'error';
  message: string;
};

export default function ImportarDisciplinas() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = trpc.import.disciplinas.useMutation();
  const salvarHistoricoMutation = trpc.admin.historico.salvar.useMutation();
  const { data: cursos } = trpc.cursos.list.useQuery();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setFile(selectedFile);
    setPreviewData([]);
    setImportResults([]);

    // Parse CSV para preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row: any) => {
          // Processar IDs de cursos (podem vir como "1,2,3" ou "1;2;3")
          let cursosIds: number[] | undefined;
          const cursosStr = row.cursos || row['Cursos (IDs)'] || '';
          if (cursosStr) {
            cursosIds = cursosStr.split(/[,;]/).map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
          }
          
          return {
            codigo: row.codigo || row['Código'] || '',
            nome: row.nome || row['Nome'] || '',
            cursos: cursosIds,
          };
        });
        setPreviewData(parsed.filter(row => row.codigo && row.nome));
      },
      error: (error) => {
        toast.error(`Erro ao ler CSV: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('Nenhum dado para importar');
      return;
    }

    setIsProcessing(true);
    try {
      const results = await importMutation.mutateAsync(previewData);
      setImportResults(results as ImportResult[]);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      // Salvar no histórico
      if (file) {
        await salvarHistoricoMutation.mutateAsync({
          tipo: 'disciplinas',
          nomeArquivo: file.name,
          totalLinhas: results.length,
          sucessos: successCount,
          erros: errorCount,
        });
      }
      
      if (errorCount === 0) {
        toast.success(`${successCount} disciplinas importadas com sucesso!`);
      } else {
        toast.warning(`${successCount} sucessos, ${errorCount} erros`);
      }
    } catch (error) {
      toast.error('Erro ao importar disciplinas');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `codigo,nome,cursos
MAT001,Matemática Básica,"1,2"
FIS001,Física I,3
QUI001,Química Geral,"1,3"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_disciplinas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neon-cyan">Importar Disciplinas</h1>
            <p className="text-muted-foreground mt-2">
              Importação em lote de novas disciplinas via CSV
            </p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Upload de Arquivo */}
        <Card className="border-neon-cyan">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Arquivo CSV
            </CardTitle>
            <CardDescription>
              Selecione um arquivo CSV com as colunas: codigo, nome, cursos (IDs separados por vírgula)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Template CSV
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Preview dos Dados */}
        {previewData.length > 0 && importResults.length === 0 && (
          <Card className="border-neon-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Preview dos Dados ({previewData.length} disciplinas)
              </CardTitle>
              <CardDescription>
                Revise os dados antes de importar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Cursos (IDs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{row.codigo}</td>
                        <td className="p-2">{row.nome}</td>
                        <td className="p-2">{row.cursos?.join(', ') || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    ... e mais {previewData.length - 10} disciplinas
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Importando...' : 'Importar Disciplinas'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados da Importação */}
        {importResults.length > 0 && (
          <Card className="border-neon-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Resultados da Importação
              </CardTitle>
              <CardDescription>
                {importResults.filter(r => r.status === 'success').length} sucessos, {importResults.filter(r => r.status === 'error').length} erros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto space-y-2">
                {importResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded ${
                      result.status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="flex-1 text-sm">
                      <strong>{result.codigo}</strong>: {result.message}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setImportResults([]);
                  }}
                  className="flex-1"
                >
                  Nova Importação
                </Button>
                <Button
                  onClick={() => setLocation('/admin/importacoes/historico')}
                  className="flex-1"
                >
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
