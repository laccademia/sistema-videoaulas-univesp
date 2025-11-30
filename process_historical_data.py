import pandas as pd
import json
import sys

def process_videoaulas_year(file_path, year):
    """Processa planilha de videoaulas de um ano específico"""
    print(f"\n=== Processando {file_path} ===")
    
    # Ler arquivo Excel
    excel_file = pd.ExcelFile(file_path)
    print(f"Abas disponíveis: {excel_file.sheet_names}")
    
    videoaulas = []
    
    # Processar abas de bimestres (formato: 2024.1, 2024.2, etc.)
    bimestre_sheets = [s for s in excel_file.sheet_names if s.startswith(str(year))]
    print(f"\nAbas de bimestres encontradas: {bimestre_sheets}")
    
    for sheet_name in bimestre_sheets:
        # Extrair número do bimestre (2024.1 -> 1)
        bimestre_num = int(sheet_name.split('.')[-1])
        print(f"\nProcessando {sheet_name} (Bimestre {bimestre_num})...")
        
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        print(f"  Colunas: {list(df.columns)}")
        print(f"  Total de linhas: {len(df)}")
        
        # Processar cada linha
        for idx, row in df.iterrows():
            # Pular linhas vazias - tentar diferentes nomes de colunas
            titulo = row.get('Título da videoaula', row.get('Título da aula', row.get('Título', row.get('TÍTULO', ''))))
            if pd.isna(titulo) or str(titulo).strip() == '':
                continue
            
            # Mapear código da disciplina
            codigo = row.get('Código', row.get('CÓD', row.get('CÓD.', row.get('cod nome', ''))))
            
            # Mapear semana
            semana_raw = row.get('Semana', row.get('Semanas', row.get('SEMANA', None)))
            semana = None
            if pd.notna(semana_raw):
                semana_str = str(semana_raw)
                # Extrair número de strings como "Quinzena 1", "Semana 2", "1", etc.
                import re
                match = re.search(r'\d+', semana_str)
                if match:
                    semana = int(match.group())
            
            # Mapear número da aula
            num_aula_raw = row.get('Nº da aula', row.get('N° de aulas', row.get('N° DA AULA', None)))
            num_aula = None
            if pd.notna(num_aula_raw):
                try:
                    num_aula = int(num_aula_raw)
                except:
                    pass
            
            # Mapear ID TV Cultura
            id_tv = row.get('ID TV Cultura', row.get('ID (TV Cultura)', row.get('ID                         (TV Cultura)', '')))
            
            # Mapear sinopse
            sinopse = row.get('Sinopse', row.get('Sinopse da Videoaula', row.get('SINOPSE', '')))
                
            videoaula = {
                'ano': year,
                'bimestre': bimestre_num,
                'semana': semana,
                'numero_aula': num_aula,
                'codigo_disciplina': str(codigo).strip() if pd.notna(codigo) else None,
                'titulo': str(titulo).strip(),
                'sinopse': str(sinopse).strip() if pd.notna(sinopse) else None,
                'professor': str(row.get('Professor', row.get('PROFESSOR', ''))).strip() if pd.notna(row.get('Professor', row.get('PROFESSOR'))) else None,
                'id_tv_cultura': str(id_tv).strip() if pd.notna(id_tv) else None,
            }
            
            videoaulas.append(videoaula)
    
    print(f"\nTotal de videoaulas processadas: {len(videoaulas)}")
    
    # Processar aba de acessibilidade se existir
    acessibilidade_data = {}
    acess_sheets = [s for s in excel_file.sheet_names if 'acessibilidade' in s.lower()]
    
    if acess_sheets:
        print(f"\nProcessando acessibilidade: {acess_sheets[0]}")
        df_acess = pd.read_excel(file_path, sheet_name=acess_sheets[0])
        print(f"  Colunas: {list(df_acess.columns)}")
        print(f"  Total de linhas: {len(df_acess)}")
        
        for idx, row in df_acess.iterrows():
            # Tentar diferentes nomes de colunas
            id_tv = row.get('ID TV Cultura', row.get('ID TV CULTURA', row.get('Título', '')))
            if pd.notna(id_tv):
                id_tv = str(id_tv).strip()
                
                link_libras = row.get('Link Libras', row.get('Link LIBRAS', ''))
                link_audio = row.get('Link Audiodescrição', row.get('Link Audiodescrição', ''))
                cc = row.get('CC/Legenda', row.get('Legendas Original', ''))
                
                if id_tv and id_tv != '':
                    acessibilidade_data[id_tv] = {
                        'link_libras': str(link_libras).strip() if pd.notna(link_libras) and str(link_libras).strip() != '' else None,
                        'link_audiodescricao': str(link_audio).strip() if pd.notna(link_audio) and str(link_audio).strip() != '' else None,
                        'cc_legenda': bool(cc) if pd.notna(cc) else False,
                    }
    
        # Aplicar dados de acessibilidade
        matched = 0
        for videoaula in videoaulas:
            if videoaula['id_tv_cultura'] and videoaula['id_tv_cultura'] in acessibilidade_data:
                videoaula.update(acessibilidade_data[videoaula['id_tv_cultura']])
                matched += 1
        
        print(f"  Dados de acessibilidade aplicados para {matched} videoaulas")
    
    return videoaulas

# Processar 2024
videoaulas_2024 = process_videoaulas_year('/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2024.xlsx', 2024)

# Processar 2023
videoaulas_2023 = process_videoaulas_year('/home/ubuntu/sistema-videoaulas-univesp/Videoaulas2023.xlsx', 2023)

# Combinar todos os dados
all_videoaulas = videoaulas_2023 + videoaulas_2024

# Salvar em JSON
output_file = '/home/ubuntu/sistema-videoaulas-univesp/videoaulas_historical.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_videoaulas, f, ensure_ascii=False, indent=2)

print(f"\n=== RESUMO ===")
print(f"2023: {len(videoaulas_2023)} videoaulas")
print(f"2024: {len(videoaulas_2024)} videoaulas")
print(f"Total: {len(all_videoaulas)} videoaulas")
print(f"\nDados salvos em: {output_file}")

# Mostrar amostra
if all_videoaulas:
    print(f"\n=== AMOSTRA (primeiras 3 videoaulas) ===")
    for v in all_videoaulas[:3]:
        print(f"  {v['ano']}.{v['bimestre']} - {v['codigo_disciplina']} - {v['titulo'][:50]}...")
