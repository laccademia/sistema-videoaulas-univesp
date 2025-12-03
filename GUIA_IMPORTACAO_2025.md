# Guia de Importação - Videoaulas 2025

## 📋 Resumo Executivo

Este documento descreve o processo completo de importação das **493 novas videoaulas de 2025** para o banco de dados do Sistema de Videoaulas Univesp.

### Estatísticas das Videoaulas Processadas

| Métrica | Valor |
|---------|-------|
| **Total de videoaulas** | 493 |
| **Bimestre 1 (2025.1)** | 153 |
| **Bimestre 2 (2025.2)** | 114 |
| **Bimestre 3 (2025.3)** | 84 |
| **Bimestre 4 (2025.4)** | 142 |
| **Disciplinas únicas** | 29 |
| **Professores** | 25 |
| **Designers Instrucionais** | 24 |

### Cobertura de Acessibilidade

| Recurso | Quantidade | Percentual |
|---------|------------|------------|
| **Libras** | 417 | 84.6% |
| **Audiodescrição** | 340 | 69.0% |
| **Legendas (CC)** | 192 | 38.9% |

---

## 🔄 Processo de Importação

### Opção 1: Importação via Interface Web (Recomendado)

#### Passo 1: Acessar Painel Administrativo

1. Faça login no sistema com credenciais de administrador
2. Navegue para: **Painel Admin → Histórico → Importar Videoaulas**
3. URL direta: `https://[seu-dominio]/admin/importar/videoaulas`

#### Passo 2: Upload do CSV

1. Clique no botão **"Choose File"**
2. Selecione o arquivo: `videoaulas_2025_completo.csv`
3. Clique em **"Importar"**

#### Passo 3: Aguardar Processamento

O sistema irá:
- ✅ Validar estrutura do CSV
- ✅ Verificar disciplinas existentes
- ✅ Criar ofertas de disciplinas para 2025
- ✅ Inserir videoaulas no banco
- ✅ Associar links de acessibilidade

**Tempo estimado**: 2-5 minutos

---

### Opção 2: Importação via Script (Avançado)

Se a interface web apresentar problemas, use o script de importação direta.

#### Criar Script de Importação

```python
#!/usr/bin/env python3
"""
Script de importação direta para banco de dados
"""
import pandas as pd
import mysql.connector
from datetime import datetime

# Configurações do banco
DB_CONFIG = {
    'host': 'seu-host.tidbcloud.com',
    'port': 4000,
    'user': 'seu-usuario',
    'password': 'sua-senha',
    'database': 'sistema_videoaulas'
}

# Ler CSV
df = pd.read_csv('/home/ubuntu/sistema-videoaulas-univesp/videoaulas_2025_completo.csv')

# Conectar ao banco
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

# Processar cada videoaula
for idx, row in df.iterrows():
    # 1. Buscar ou criar disciplina
    cursor.execute("""
        SELECT id FROM disciplinas WHERE codigo = %s
    """, (row['codigo'],))
    
    disciplina_result = cursor.fetchone()
    
    if not disciplina_result:
        print(f"⚠️  Disciplina não encontrada: {row['codigo']} - {row['disciplina']}")
        continue
    
    disciplina_id = disciplina_result[0]
    
    # 2. Buscar ou criar oferta de disciplina
    cursor.execute("""
        SELECT id FROM ofertas_disciplinas 
        WHERE disciplina_id = %s AND ano = %s AND bimestre_operacional = %s
    """, (disciplina_id, row['ano'], row['bimestre']))
    
    oferta_result = cursor.fetchone()
    
    if not oferta_result:
        # Criar nova oferta
        cursor.execute("""
            INSERT INTO ofertas_disciplinas 
            (disciplina_id, ano, bimestre_operacional, tipo)
            VALUES (%s, %s, %s, 'regular')
        """, (disciplina_id, row['ano'], row['bimestre']))
        
        oferta_id = cursor.lastrowid
        print(f"✓ Oferta criada: {row['codigo']} - {row['ano']}.{row['bimestre']}")
    else:
        oferta_id = oferta_result[0]
    
    # 3. Inserir videoaula
    cursor.execute("""
        INSERT INTO videoaulas (
            oferta_disciplina_id, semana, numero_aula, titulo, sinopse,
            link_youtube_original, slides_disponivel, status, id_tv_cultura,
            duracao_minutos, link_libras, link_audiodescricao, cc_legenda,
            link_download
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """, (
        oferta_id,
        row['semana'],
        row['numeroAula'],
        row['titulo'],
        row['sinopse'],
        row['linkYoutubeOriginal'],
        row['slidesDisponivel'],
        row['status'],
        row['idTvCultura'],
        row['duracaoMinutos'],
        row['linkLibras'],
        row['linkAudiodescricao'],
        row['ccLegenda'],
        row['linkDownload']
    ))
    
    if (idx + 1) % 50 == 0:
        print(f"Progresso: {idx + 1}/{len(df)} videoaulas importadas")

# Commit e fechar
conn.commit()
cursor.close()
conn.close()

print(f"\n✅ Importação concluída: {len(df)} videoaulas")
```

---

## ⚠️ Problemas Identificados

### 14 Videoaulas Sem Link do YouTube

As seguintes videoaulas não possuem link do YouTube e precisam ser verificadas:

Para listar essas videoaulas:

```bash
grep -n ',,,' videoaulas_2025_completo.csv | head -20
```

**Ação recomendada**: Verificar com a equipe de produção se os vídeos ainda não foram publicados ou se há erro nos dados.

---

## 🔍 Validação Pós-Importação

Após a importação, execute as seguintes queries para validar:

### 1. Verificar Total de Videoaulas

```sql
SELECT COUNT(*) as total 
FROM videoaulas v
JOIN ofertas_disciplinas od ON v.oferta_disciplina_id = od.id
WHERE od.ano = 2025;
```

**Resultado esperado**: 493

### 2. Verificar Distribuição por Bimestre

```sql
SELECT od.bimestre_operacional, COUNT(*) as total
FROM videoaulas v
JOIN ofertas_disciplinas od ON v.oferta_disciplina_id = od.id
WHERE od.ano = 2025
GROUP BY od.bimestre_operacional
ORDER BY od.bimestre_operacional;
```

**Resultado esperado**:
| Bimestre | Total |
|----------|-------|
| 1 | 153 |
| 2 | 114 |
| 3 | 84 |
| 4 | 142 |

### 3. Verificar Acessibilidade

```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN link_libras IS NOT NULL AND link_libras != '' THEN 1 ELSE 0 END) as com_libras,
    SUM(CASE WHEN link_audiodescricao IS NOT NULL AND link_audiodescricao != '' THEN 1 ELSE 0 END) as com_audio,
    SUM(CASE WHEN cc_legenda IS NOT NULL AND cc_legenda != '' THEN 1 ELSE 0 END) as com_cc
FROM videoaulas v
JOIN ofertas_disciplinas od ON v.oferta_disciplina_id = od.id
WHERE od.ano = 2025;
```

---

## 📊 Próximos Passos

Após a importação bem-sucedida:

1. ✅ **Verificar no Dashboard**: Total de videoaulas deve ser 1887 + 493 = **2380**
2. ✅ **Testar Filtros**: Filtrar por ano 2025 deve retornar 493 videoaulas
3. ✅ **Validar Links**: Testar alguns links de YouTube, Libras e Audiodescrição
4. ✅ **Notificar Equipe**: Informar que as videoaulas 2025 estão disponíveis

---

## 📞 Suporte

Em caso de problemas durante a importação:

1. Verificar logs do servidor
2. Validar credenciais do banco de dados
3. Confirmar que todas as disciplinas existem no banco
4. Contatar equipe técnica com detalhes do erro

---

**Documento gerado em**: 02/12/2025  
**Versão**: 1.0  
**Arquivo CSV**: `videoaulas_2025_completo.csv`
