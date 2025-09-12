-- COMPLETE TRACK MODULES INSERTION SCRIPT
-- Run this after the basic tracks have been inserted

-- Continue Track 2: Content Strategy Modules (remaining)

-- Module 2.3: Editorial Calendar
INSERT INTO track_modules (
  id,
  track_id,
  title,
  content,
  order_index,
  video_url,
  tools
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Estratégia de Conteúdo com IA'),
  'Calendário Editorial Inteligente',
  '{
    "briefing": "Crie e gerencie calendários editoriais dinâmicos usando IA para otimizar timing, frequência e distribuição de conteúdo baseado em dados de performance e comportamento da audiência.",
    "objectives": [
      "Criar calendários editoriais orientados por dados",
      "Otimizar timing de publicação usando IA",
      "Automatizar distribuição multi-canal",
      "Implementar sistema de aprovação e workflow"
    ],
    "prompts": [
      {
        "id": "cs_3_1",
        "title": "Calendário Editorial Mensal",
        "description": "Gere um calendário editorial completo para o próximo mês",
        "content": "Crie um calendário editorial detalhado para [MÊS] considerando: 1) Mix otimizado de tipos de conteúdo baseado na performance histórica, 2) Timing ideal de publicação para cada canal, 3) Temas sazonais e trending topics relevantes, 4) Distribuição balanceada entre conteúdo educativo, promocional e de entretenimento. Dados históricos: [INSIRA DADOS DE PERFORMANCE]"
      },
      {
        "id": "cs_3_2",
        "title": "Otimização de Frequência",
        "description": "Encontre a frequência ideal de postagem para cada canal",
        "content": "Analise meus dados de engajamento e recomende: 1) Frequência ótima de postagem para cada plataforma, 2) Melhores horários de publicação baseado na audiência, 3) Cadência de diferentes tipos de conteúdo, 4) Ajustes sazonais na estratégia de frequência. Dados de engajamento: [COLE DADOS DE ANALYTICS]"
      }
    ],
    "resources": [
      {
        "title": "Template de Calendário Editorial",
        "description": "Planilha completa com automações e métricas",
        "url": "https://drive.google.com/editorial-calendar-template",
        "type": "document"
      },
      {
        "title": "Content Calendar Tools Comparison",
        "description": "Comparativo das melhores ferramentas de calendário editorial",
        "url": "https://blog.hootsuite.com/content-calendar-tools/",
        "type": "link"
      }
    ]
  }',
  2,
  'https://www.youtube.com/watch?v=sXMQ1NqWmKA',
  '{
    "recommended_tools": [
      {
        "id": "calendar_optimizer",
        "title": "Otimizador de Calendário",
        "description": "Sugere timing e frequência ótima baseado em dados"
      }
    ]
  }'
),

-- Module 2.4: Content Distribution
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Estratégia de Conteúdo com IA'),
  'Distribuição e Amplificação',
  '{
    "briefing": "Maximize o alcance do seu conteúdo através de estratégias inteligentes de distribuição multi-canal e técnicas de amplificação orgânica e paga.",
    "objectives": [
      "Desenvolver estratégias de distribuição multi-canal",
      "Implementar amplificação orgânica sistemática", 
      "Otimizar conteúdo para cada plataforma específica",
      "Medir e otimizar ROI de distribuição"
    ],
    "prompts": [
      {
        "id": "cs_4_1",
        "title": "Estratégia de Distribuição Multi-Canal",
        "description": "Crie um plano de distribuição adaptado para cada canal",
        "content": "Desenvolva uma estratégia de distribuição para este conteúdo: [DESCREVA O CONTEÚDO] considerando: 1) Adaptação específica para cada canal (LinkedIn, Instagram, YouTube, etc.), 2) Timing otimizado para cada plataforma, 3) Chamadas para ação específicas por canal, 4) Métricas de sucesso para cada distribuição. Canais disponíveis: [LISTE SEUS CANAIS]"
      },
      {
        "id": "cs_4_2",
        "title": "Plano de Amplificação Orgânica",
        "description": "Maximize alcance orgânico através de técnicas avançadas",
        "content": "Crie um plano de amplificação orgânica que inclua: 1) Estratégias de cross-promotion entre canais, 2) Parcerias e colaborações para amplificar reach, 3) User-generated content e advocacy, 4) SEO e otimização para descoberta orgânica. Conteúdo base: [DESCREVA O CONTEÚDO A SER AMPLIFICADO]"
      }
    ],
    "resources": [
      {
        "title": "Multi-Channel Distribution Guide",
        "description": "Guia completo de distribuição para diferentes canais",
        "url": "https://contentmarketinginstitute.com/distribution-guide/",
        "type": "link"
      },
      {
        "title": "Content Amplification Checklist",
        "description": "Checklist de 50 táticas de amplificação de conteúdo",
        "url": "https://drive.google.com/amplification-checklist",
        "type": "document"
      }
    ]
  }',
  3,
  'https://www.youtube.com/watch?v=xNPuX6ZQHBU',
  '{
    "recommended_tools": [
      {
        "id": "distribution_optimizer",
        "title": "Otimizador de Distribuição",
        "description": "Automatiza e otimiza distribuição multi-canal"
      }
    ]
  }'
),

-- Module 2.5: Performance Analysis
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Estratégia de Conteúdo com IA'),
  'Análise de Performance e Otimização',
  '{
    "briefing": "Domine a análise de dados de conteúdo para identificar padrões de sucesso, otimizar performance e tomar decisões estratégicas baseadas em insights acionáveis.",
    "objectives": [
      "Configurar dashboards de performance abrangentes",
      "Identificar padrões em conteúdo de alta performance",
      "Implementar testes A/B sistemáticos",
      "Criar loops de feedback para melhoria contínua"
    ],
    "prompts": [
      {
        "id": "cs_5_1",
        "title": "Análise de Performance Profunda",
        "description": "Identifique os fatores que tornam seu conteúdo mais eficaz",
        "content": "Analise os dados de performance do meu conteúdo e identifique: 1) Características comuns nos 10 conteúdos com melhor performance, 2) Padrões temporais e sazonais no engajamento, 3) Correlações entre formato, tema e resultado, 4) Recomendações específicas para otimização futura. Dados: [COLE DADOS DE ANALYTICS DE 3-6 MESES]"
      },
      {
        "id": "cs_5_2",
        "title": "Plano de Testes A/B",
        "description": "Crie experimentos estruturados para otimizar conteúdo",
        "content": "Desenvolva um plano de testes A/B para otimizar [ASPECTO DO CONTEÚDO] incluindo: 1) Hipóteses claras baseadas em dados, 2) Variáveis a serem testadas e critérios de sucesso, 3) Metodologia de teste e duração necessária, 4) Processo de implementação dos learnings. Dados base: [DESCREVA PERFORMANCE ATUAL]"
      }
    ],
    "resources": [
      {
        "title": "Content Analytics Dashboard Template",
        "description": "Dashboard completo para acompanhar performance de conteúdo",
        "url": "https://drive.google.com/content-analytics-dashboard",
        "type": "document"
      },
      {
        "title": "A/B Testing Guide for Content",
        "description": "Guia completo de testes A/B para marketing de conteúdo",
        "url": "https://blog.hubspot.com/marketing/how-to-do-a-b-tests",
        "type": "link"
      }
    ]
  }',
  4,
  'https://www.youtube.com/watch?v=QjjEYg_wKOo',
  '{
    "recommended_tools": [
      {
        "id": "performance_analyzer",
        "title": "Analisador de Performance",
        "description": "Analisa padrões e sugere otimizações baseado em dados"
      }
    ]
  }'
);

-- Track 3: Copywriting Modules (Premium Content)

INSERT INTO track_modules (
  id,
  track_id,
  title,
  content,
  order_index,
  video_url,
  tools
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Copywriting com IA Avançado'),
  'Psicologia da Persuasão Digital',
  '{
    "briefing": "Domine os princípios psicológicos que tornam textos irresistíveis. Aprenda a aplicar gatilhos mentais, técnicas de persuasão e neurociência do marketing em copies que convertem.",
    "objectives": [
      "Dominar os 7 gatilhos mentais fundamentais",
      "Aplicar princípios de neurociência em copywriting",
      "Criar textos que ativam respostas emocionais específicas",
      "Usar IA para testar e otimizar persuasão"
    ],
    "prompts": [
      {
        "id": "cp_1_1",
        "title": "Análise Psicológica de Copy",
        "description": "Analise um copy sob perspectiva psicológica e identifique melhorias",
        "content": "Analise este copy sob a perspectiva da psicologia da persuasão: [COLE SEU COPY]. Identifique: 1) Gatilhos mentais já presentes e sua eficácia, 2) Oportunidades perdidas de persuasão, 3) Pontos onde a resistência do leitor pode aumentar, 4) Versão otimizada incorporando técnicas psicológicas avançadas."
      },
      {
        "id": "cp_1_2",
        "title": "Copy com Gatilhos Mentais",
        "description": "Crie copy incorporando gatilhos mentais estratégicos",
        "content": "Crie um copy para [PRODUTO/SERVIÇO] incorporando estrategicamente: 1) Escassez (limitação genuína), 2) Prova social (depoimentos/números), 3) Autoridade (credibilidade), 4) Reciprocidade (valor antecipado). Ensure que cada gatilho seja autêntico e reforce a proposta de valor. Detalhes do produto: [DESCREVA PRODUTO E PÚBLICO]"
      }
    ],
    "resources": [
      {
        "title": "Psychological Triggers Handbook",
        "description": "Manual completo dos gatilhos mentais em marketing",
        "url": "https://blog.hubspot.com/marketing/psychological-triggers",
        "type": "link"
      },
      {
        "title": "Copy Psychology Checklist",
        "description": "Checklist para revisar copy sob perspectiva psicológica",
        "url": "https://drive.google.com/copy-psychology-checklist",
        "type": "document"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=cQGqaRm0t8w',
  '{
    "recommended_tools": [
      {
        "id": "psychology_analyzer",
        "title": "Analisador Psicológico de Copy",
        "description": "Analisa copy identificando gatilhos mentais e oportunidades"
      }
    ]
  }'
),

-- Track 4: Business Strategy Modules (continuing pattern...)

INSERT INTO track_modules (
  id,
  track_id,
  title,
  content,
  order_index,
  video_url,
  tools
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Estratégia de Negócios com IA'),
  'Análise de Mercado com IA',
  '{
    "briefing": "Revolucione sua análise de mercado usando inteligência artificial para obter insights profundos sobre concorrência, oportunidades e tendências que seus concorrentes estão perdendo.",
    "objectives": [
      "Realizar análise competitiva automatizada com IA",
      "Identificar nichos e oportunidades inexploradas",
      "Mapear tendências emergentes antes da concorrência",
      "Criar estratégias de posicionamento baseadas em dados"
    ],
    "prompts": [
      {
        "id": "bs_1_1",
        "title": "Análise Competitiva 360°",
        "description": "Análise completa da concorrência usando IA",
        "content": "Faça uma análise competitiva abrangente dos meus principais concorrentes: [LISTE 5 CONCORRENTES]. Para cada um, analise: 1) Estratégias de conteúdo e posicionamento, 2) Pontos fortes e vulnerabilidades, 3) Gaps que posso explorar, 4) Oportunidades de diferenciação estratégica. Meu negócio: [DESCREVA SEU NEGÓCIO]"
      }
    ],
    "resources": [
      {
        "title": "Market Analysis Framework",
        "description": "Framework completo para análise de mercado com IA",
        "url": "https://blog.hubspot.com/marketing/market-analysis",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=mHQ2qQbgIWY',
  '{
    "recommended_tools": [
      {
        "id": "market_analyzer",
        "title": "Analisador de Mercado IA",
        "description": "Análise automatizada de mercado e concorrência"
      }
    ]
  }'
);

-- Additional simplified modules for remaining tracks to complete the system
-- Track 5: Marketing Automation

INSERT INTO track_modules (
  id,
  track_id,
  title,
  content,
  order_index,
  video_url,
  tools
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Automação de Marketing com IA'),
  'Fundamentos da Automação Inteligente',
  '{
    "briefing": "Aprenda os conceitos fundamentais de automação de marketing e como a IA pode tornar seus fluxos mais eficientes e personalizados.",
    "objectives": [
      "Entender princípios de automação de marketing",
      "Configurar fluxos básicos de email marketing",
      "Implementar segmentação inteligente",
      "Medir ROI de campanhas automatizadas"
    ],
    "prompts": [
      {
        "id": "ma_1_1",
        "title": "Fluxo de Email Welcome",
        "description": "Crie uma sequência de boas-vindas personalizada",
        "content": "Crie uma sequência de 5 emails de boas-vindas para novos leads que: 1) Apresente valor imediato no primeiro email, 2) Eduque sobre benefícios do produto/serviço, 3) Construa autoridade e confiança, 4) Termine com oferta irresistível. Meu negócio: [DESCREVA SEU NEGÓCIO]"
      }
    ],
    "resources": [
      {
        "title": "Email Automation Guide",
        "description": "Guia completo de automação de email marketing",
        "url": "https://mailchimp.com/marketing-automation/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=3Sk7cOqB9Dk',
  '{
    "recommended_tools": [
      {
        "id": "automation_builder",
        "title": "Construtor de Automações",
        "description": "Cria fluxos de automação personalizados"
      }
    ]
  }'
),

-- Track 6: Data Analysis
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Análise de Dados com IA'),
  'Introdução à Análise de Dados',
  '{
    "briefing": "Fundamentos essenciais para transformar dados brutos em insights acionáveis usando ferramentas de inteligência artificial.",
    "objectives": [
      "Compreender tipos de dados e métricas relevantes",
      "Configurar dashboards básicos de análise",
      "Identificar padrões em dados de marketing",
      "Tomar decisões baseadas em dados"
    ],
    "prompts": [
      {
        "id": "da_1_1",
        "title": "Dashboard de Marketing",
        "description": "Configure um dashboard completo para acompanhar performance",
        "content": "Ajude-me a criar um dashboard de marketing que monitore: 1) KPIs principais do meu negócio, 2) Métricas de cada canal (orgânico, pago, email, social), 3) Funil de conversão detalhado, 4) Alertas para mudanças significativas. Meu negócio: [DESCREVA MODELO DE NEGÓCIO]"
      }
    ],
    "resources": [
      {
        "title": "Data Analysis for Marketers",
        "description": "Curso introdutório de análise de dados para marketing",
        "url": "https://analytics.google.com/analytics/academy/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=yZvFH7B6gKI',
  '{
    "recommended_tools": [
      {
        "id": "dashboard_creator",
        "title": "Criador de Dashboards",
        "description": "Gera dashboards personalizados baseados no seu negócio"
      }
    ]
  }'
),

-- Track 7: Social Media
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Redes Sociais com IA'),
  'Estratégia de Conteúdo para Redes Sociais',
  '{
    "briefing": "Desenvolva uma estratégia sólida de conteúdo para redes sociais usando IA para otimizar alcance, engajamento e conversões.",
    "objectives": [
      "Criar estratégia específica para cada rede social",
      "Desenvolver calendário de conteúdo otimizado",
      "Usar IA para gerar ideias de posts virais",
      "Analisar performance e otimizar resultados"
    ],
    "prompts": [
      {
        "id": "sm_1_1",
        "title": "Estratégia Instagram",
        "description": "Desenvolva estratégia completa para Instagram",
        "content": "Crie uma estratégia de Instagram para o próximo mês incluindo: 1) Mix de tipos de conteúdo (posts, stories, reels), 2) Temas e pilares de conteúdo, 3) Hashtags estratégicas por nicho, 4) Timing otimizado de publicação. Meu negócio: [DESCREVA SEU NEGÓCIO E PÚBLICO]"
      }
    ],
    "resources": [
      {
        "title": "Social Media Strategy Template",
        "description": "Template completo de estratégia para redes sociais",
        "url": "https://drive.google.com/social-strategy-template",
        "type": "document"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=R4RuYs_KWMg',
  '{
    "recommended_tools": [
      {
        "id": "social_planner",
        "title": "Planejador Social IA",
        "description": "Gera estratégias e conteúdo para redes sociais"
      }
    ]
  }'
),

-- Track 8: Productivity
(
  gen_random_uuid(),
  (SELECT id FROM tracks WHERE title = 'Produtividade com IA'),
  'Automatização de Tarefas Pessoais',
  '{
    "briefing": "Aprenda a usar IA para automatizar tarefas repetitivas e otimizar sua rotina pessoal e profissional para máxima eficiência.",
    "objectives": [
      "Identificar tarefas que podem ser automatizadas",
      "Configurar assistentes IA para tarefas rotineiras",
      "Otimizar fluxos de trabalho com ferramentas de IA",
      "Medir ganhos de produtividade"
    ],
    "prompts": [
      {
        "id": "pr_1_1",
        "title": "Auditoria de Produtividade",
        "description": "Analise sua rotina e identifique oportunidades de otimização",
        "content": "Analise minha rotina diária e identifique: 1) Tarefas repetitivas que consomem muito tempo, 2) Processos que podem ser automatizados com IA, 3) Ferramentas específicas para cada otimização, 4) Plano de implementação gradual. Minha rotina: [DESCREVA SUA ROTINA DETALHADAMENTE]"
      }
    ],
    "resources": [
      {
        "title": "AI Productivity Tools Guide",
        "description": "Guia das melhores ferramentas de IA para produtividade",
        "url": "https://blog.zapier.com/ai-productivity-tools/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=TQCBRKj_wfE',
  '{
    "recommended_tools": [
      {
        "id": "productivity_optimizer",
        "title": "Otimizador de Produtividade",
        "description": "Analisa rotinas e sugere automações personalizadas"
      }
    ]
  }'
);

-- Update track module counts
UPDATE tracks SET total_modules = (
  SELECT COUNT(*) 
  FROM track_modules 
  WHERE track_modules.track_id = tracks.id
);

-- Final verification
SELECT 
  t.title,
  t.category,
  t.difficulty_level,
  t.is_premium,
  t.total_modules,
  COUNT(tm.id) as actual_modules
FROM tracks t
LEFT JOIN track_modules tm ON t.id = tm.track_id
GROUP BY t.id, t.title, t.category, t.difficulty_level, t.is_premium, t.total_modules
ORDER BY t.order_index;