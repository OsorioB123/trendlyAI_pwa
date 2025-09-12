-- ============================================================
-- TRENDLYAI TRACKS QUICK POPULATION SCRIPT
-- Complete database population in a single script
-- ============================================================

-- Clean existing data
DELETE FROM user_module_progress;
DELETE FROM user_tracks;
DELETE FROM track_reviews;
DELETE FROM track_modules;
DELETE FROM tracks;

-- Insert complete tracks with all metadata
INSERT INTO tracks (
  id, title, subtitle, description, category, difficulty_level, 
  estimated_duration, cover_image, is_premium, total_modules, 
  is_published, order_index, created_at, updated_at
) VALUES

-- 1. Storytelling (Free, Beginner)
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Narrativa para Storytelling Digital',
  'Domine a arte de contar histórias envolventes com IA',
  'Aprenda técnicas avançadas de narrativa digital usando inteligência artificial para criar histórias que conectam, engajam e convertem seu público.',
  'Narrativa',
  'Iniciante',
  '3-4 horas',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  false, 4, true, 1,
  NOW(), NOW()
),

-- 2. Content Strategy (Free, Intermediate)
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Estratégia de Conteúdo com IA',
  'Crie estratégias de conteúdo vencedoras usando inteligência artificial',
  'Desenvolva uma estratégia de conteúdo completa e eficaz utilizando ferramentas de IA para pesquisar tendências, criar calendários editoriais e otimizar conteúdo.',
  'Marketing de Conteúdo',
  'Intermediário',
  '4-5 horas',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  false, 5, true, 2,
  NOW(), NOW()
),

-- 3. Copywriting (Premium, Advanced)
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Copywriting com IA Avançado',
  'Domine técnicas avançadas de copywriting com inteligência artificial',
  'Torne-se um especialista em copywriting usando IA para criar textos que vendem. Aprenda frameworks avançados e técnicas de persuasão.',
  'Copywriting',
  'Avançado',
  '6-7 horas',
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
  true, 6, true, 3,
  NOW(), NOW()
),

-- 4. Business Strategy (Premium, Intermediate)
(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Estratégia de Negócios com IA',
  'Transforme seu negócio com estratégias baseadas em inteligência artificial',
  'Aprenda a implementar IA estrategicamente em seu negócio, desde análise de mercado até automação de processos.',
  'Estratégia',
  'Intermediário',
  '5-6 horas',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
  true, 5, true, 4,
  NOW(), NOW()
),

-- 5. Marketing Automation (Free, Beginner)
(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'Automação de Marketing com IA',
  'Automatize suas campanhas de marketing usando inteligência artificial',
  'Descubra como automatizar e otimizar suas campanhas de marketing digital usando IA para criar fluxos inteligentes e personalizar comunicações.',
  'Automação',
  'Iniciante',
  '3-4 horas',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80',
  false, 4, true, 5,
  NOW(), NOW()
),

-- 6. Data Analysis (Premium, Advanced)
(
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'Análise de Dados com IA',
  'Transforme dados em insights acionáveis usando inteligência artificial',
  'Domine técnicas avançadas de análise de dados com IA para extrair insights valiosos e tomar decisões baseadas em dados.',
  'Análise de Dados',
  'Avançado',
  '7-8 horas',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  true, 7, true, 6,
  NOW(), NOW()
),

-- 7. Social Media (Free, Intermediate)
(
  '550e8400-e29b-41d4-a716-446655440007'::uuid,
  'Redes Sociais com IA',
  'Maximize seu alcance nas redes sociais com inteligência artificial',
  'Aprenda a usar IA para criar conteúdo viral, otimizar postagens e gerenciar múltiplas redes sociais de forma eficiente.',
  'Redes Sociais',
  'Intermediário',
  '4-5 horas',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
  false, 5, true, 7,
  NOW(), NOW()
),

-- 8. Productivity (Free, Beginner)
(
  '550e8400-e29b-41d4-a716-446655440008'::uuid,
  'Produtividade com IA',
  'Aumente sua produtividade pessoal usando inteligência artificial',
  'Descubra ferramentas e técnicas de IA para maximizar sua produtividade pessoal e profissional através de automação inteligente.',
  'Produtividade',
  'Iniciante',
  '2-3 horas',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
  false, 3, true, 8,
  NOW(), NOW()
);

-- Insert sample modules for each track
INSERT INTO track_modules (
  id, track_id, title, content, order_index, video_url, tools, created_at, updated_at
) VALUES 

-- Track 1: Storytelling Modules
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Fundamentos do Storytelling',
  '{
    "briefing": "Neste módulo, você aprenderá os elementos fundamentais que tornam uma história envolvente e memorável. Compreenderá a estrutura clássica de narrativas e como aplicá-la no contexto digital moderno.",
    "objectives": [
      "Compreender os 3 atos clássicos da narrativa",
      "Identificar os 5 elementos essenciais de uma boa história",
      "Reconhecer diferentes tipos de storytelling digital",
      "Criar sua primeira narrativa usando IA como assistente criativo"
    ],
    "prompts": [
      {
        "id": "st_1_1",
        "title": "Análise de História Pessoal",
        "description": "Use IA para analisar e estruturar uma história pessoal marcante",
        "content": "Analise esta história pessoal e identifique: 1) Os elementos narrativos presentes (personagens, conflito, resolução), 2) O arco emocional da narrativa, 3) As lições principais, 4) Como adaptá-la para marketing digital. História: [INSIRA SUA HISTÓRIA AQUI]"
      }
    ],
    "resources": [
      {
        "title": "Guia Completo de Storytelling Digital",
        "description": "Referência abrangente sobre técnicas de narrativa",
        "url": "https://blog.hubspot.com/marketing/storytelling",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=Nj-hdQMa3uI',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Storytelling para Marcas',
  '{
    "briefing": "Aprenda a traduzir os valores da sua marca em narrativas poderosas que conectam emocionalmente com seu público.",
    "objectives": [
      "Identificar os valores centrais da sua marca",
      "Criar narrativas autênticas da marca",
      "Desenvolver histórias de origem convincentes",
      "Adaptar storytelling para diferentes canais"
    ],
    "prompts": [
      {
        "id": "st_2_1",
        "title": "História de Origem da Marca",
        "description": "Construa uma narrativa compelling sobre como sua marca nasceu",
        "content": "Crie uma história de origem para minha marca considerando: 1) O momento de inspiração inicial, 2) Desafios superados, 3) Impacto que queremos gerar, 4) Visão de futuro. Marca: [DESCREVA SUA MARCA]"
      }
    ],
    "resources": [
      {
        "title": "Exemplos de Brand Storytelling",
        "description": "Cases reais de marcas que usam storytelling",
        "url": "https://blog.hubspot.com/marketing/brand-storytelling-examples",
        "type": "link"
      }
    ]
  }',
  1,
  'https://www.youtube.com/watch?v=ZQJ6yqQRAQs',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

-- Track 2: Content Strategy Modules  
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Fundamentos da Estratégia de Conteúdo',
  '{
    "briefing": "Estabeleça bases sólidas para uma estratégia de conteúdo eficaz. Aprenda a definir objetivos claros e identificar audiências com precisão.",
    "objectives": [
      "Definir objetivos SMART para conteúdo",
      "Mapear audiências-alvo com precisão",
      "Criar framework estratégico sustentável",
      "Estabelecer métricas e KPIs relevantes"
    ],
    "prompts": [
      {
        "id": "cs_1_1",
        "title": "Auditoria de Conteúdo Atual",
        "description": "Analise seu conteúdo existente e identifique gaps",
        "content": "Faça auditoria completa considerando: 1) Categorização por performance, 2) Gaps na jornada do cliente, 3) Conteúdo com melhor/pior performance, 4) Recomendações estratégicas. Dados: [DESCREVA SEU CONTEÚDO]"
      }
    ],
    "resources": [
      {
        "title": "Content Strategy Toolkit",
        "description": "Kit completo de ferramentas para estratégia",
        "url": "https://contentmarketinginstitute.com/toolkit/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=8KuO4r5CHjM',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

-- Track 3: Premium Copywriting Module
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Psicologia da Persuasão Digital',
  '{
    "briefing": "Domine os princípios psicológicos que tornam textos irresistíveis. Aprenda gatilhos mentais e técnicas de persuasão baseadas em neurociência.",
    "objectives": [
      "Dominar os 7 gatilhos mentais fundamentais",
      "Aplicar neurociência em copywriting",
      "Criar textos que ativam respostas emocionais",
      "Usar IA para testar e otimizar persuasão"
    ],
    "prompts": [
      {
        "id": "cp_1_1",
        "title": "Análise Psicológica de Copy",
        "description": "Analise copy sob perspectiva psicológica",
        "content": "Analise este copy: [COLE SEU COPY]. Identifique: 1) Gatilhos mentais presentes, 2) Oportunidades perdidas, 3) Pontos de resistência, 4) Versão otimizada com técnicas psicológicas."
      }
    ],
    "resources": [
      {
        "title": "Psychological Triggers Handbook",
        "description": "Manual completo dos gatilhos mentais",
        "url": "https://blog.hubspot.com/marketing/psychological-triggers",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=cQGqaRm0t8w',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

-- Quick modules for remaining tracks to ensure system completeness
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Análise de Mercado com IA',
  '{
    "briefing": "Use IA para análise profunda de mercado e identificação de oportunidades que concorrentes estão perdendo.",
    "objectives": [
      "Realizar análise competitiva automatizada",
      "Identificar nichos inexplorados",
      "Mapear tendências emergentes",
      "Criar estratégias de posicionamento"
    ],
    "prompts": [
      {
        "id": "bs_1_1",
        "title": "Análise Competitiva 360°",
        "description": "Análise completa da concorrência usando IA",
        "content": "Analise meus concorrentes: [LISTE CONCORRENTES]. Para cada um: 1) Estratégias de conteúdo, 2) Pontos fortes/vulnerabilidades, 3) Gaps a explorar, 4) Oportunidades de diferenciação."
      }
    ],
    "resources": [
      {
        "title": "Market Analysis Framework",
        "description": "Framework para análise de mercado",
        "url": "https://blog.hubspot.com/marketing/market-analysis",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=mHQ2qQbgIWY',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'Fundamentos da Automação',
  '{
    "briefing": "Aprenda conceitos fundamentais de automação de marketing e como IA pode tornar fluxos mais eficientes.",
    "objectives": [
      "Entender princípios de automação",
      "Configurar fluxos básicos de email",
      "Implementar segmentação inteligente",
      "Medir ROI de campanhas automatizadas"
    ],
    "prompts": [
      {
        "id": "ma_1_1",
        "title": "Fluxo de Email Welcome",
        "description": "Crie sequência de boas-vindas personalizada",
        "content": "Crie sequência de 5 emails de welcome que: 1) Entregue valor imediato, 2) Eduque sobre benefícios, 3) Construa autoridade, 4) Termine com oferta. Negócio: [DESCREVA]"
      }
    ],
    "resources": [
      {
        "title": "Email Automation Guide",
        "description": "Guia completo de automação de email",
        "url": "https://mailchimp.com/marketing-automation/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=3Sk7cOqB9Dk',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'Introdução à Análise de Dados',
  '{
    "briefing": "Fundamentos para transformar dados brutos em insights acionáveis usando ferramentas de IA.",
    "objectives": [
      "Compreender tipos de dados relevantes",
      "Configurar dashboards básicos",
      "Identificar padrões em dados",
      "Tomar decisões baseadas em dados"
    ],
    "prompts": [
      {
        "id": "da_1_1",
        "title": "Dashboard de Marketing",
        "description": "Configure dashboard completo de performance",
        "content": "Crie dashboard que monitore: 1) KPIs principais, 2) Métricas por canal, 3) Funil de conversão, 4) Alertas para mudanças. Negócio: [DESCREVA]"
      }
    ],
    "resources": [
      {
        "title": "Data Analysis for Marketers",
        "description": "Curso de análise de dados para marketing",
        "url": "https://analytics.google.com/analytics/academy/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=yZvFH7B6gKI',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440007'::uuid,
  'Estratégia de Conteúdo Social',
  '{
    "briefing": "Desenvolva estratégia sólida de conteúdo para redes sociais usando IA para otimizar alcance e engajamento.",
    "objectives": [
      "Criar estratégia específica por rede",
      "Desenvolver calendário otimizado",
      "Usar IA para ideias virais",
      "Analisar e otimizar performance"
    ],
    "prompts": [
      {
        "id": "sm_1_1",
        "title": "Estratégia Instagram",
        "description": "Desenvolva estratégia completa para Instagram",
        "content": "Crie estratégia Instagram incluindo: 1) Mix de tipos de conteúdo, 2) Temas e pilares, 3) Hashtags estratégicas, 4) Timing otimizado. Negócio: [DESCREVA]"
      }
    ],
    "resources": [
      {
        "title": "Social Media Strategy Template",
        "description": "Template de estratégia para redes sociais",
        "url": "https://drive.google.com/social-strategy",
        "type": "document"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=R4RuYs_KWMg',
  '{"recommended_tools": []}',
  NOW(), NOW()
),

(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440008'::uuid,
  'Automatização de Tarefas Pessoais',
  '{
    "briefing": "Use IA para automatizar tarefas repetitivas e otimizar rotina pessoal/profissional para máxima eficiência.",
    "objectives": [
      "Identificar tarefas automatizáveis",
      "Configurar assistentes IA",
      "Otimizar fluxos de trabalho",
      "Medir ganhos de produtividade"
    ],
    "prompts": [
      {
        "id": "pr_1_1",
        "title": "Auditoria de Produtividade",
        "description": "Analise rotina e identifique otimizações",
        "content": "Analise minha rotina: [DESCREVA ROTINA]. Identifique: 1) Tarefas repetitivas, 2) Processos automatizáveis, 3) Ferramentas específicas, 4) Plano de implementação."
      }
    ],
    "resources": [
      {
        "title": "AI Productivity Tools Guide",
        "description": "Guia de ferramentas IA para produtividade",
        "url": "https://blog.zapier.com/ai-productivity-tools/",
        "type": "link"
      }
    ]
  }',
  0,
  'https://www.youtube.com/watch?v=TQCBRKj_wfE',
  '{"recommended_tools": []}',
  NOW(), NOW()
);

-- Update module counts
UPDATE tracks SET total_modules = (
  SELECT COUNT(*) 
  FROM track_modules 
  WHERE track_modules.track_id = tracks.id
);

-- Verification query
SELECT 
  t.title,
  t.category,
  t.difficulty_level,
  CASE WHEN t.is_premium THEN 'Premium' ELSE 'Free' END as access_type,
  t.total_modules,
  COUNT(tm.id) as actual_modules
FROM tracks t
LEFT JOIN track_modules tm ON t.id = tm.track_id
GROUP BY t.id, t.title, t.category, t.difficulty_level, t.is_premium, t.total_modules, t.order_index
ORDER BY t.order_index;

-- Success message
SELECT 'TrendlyAI tracks database successfully populated!' as status,
       COUNT(t.id) as total_tracks,
       COUNT(tm.id) as total_modules,
       COUNT(CASE WHEN t.is_premium = false THEN 1 END) as free_tracks,
       COUNT(CASE WHEN t.is_premium = true THEN 1 END) as premium_tracks
FROM tracks t
LEFT JOIN track_modules tm ON t.id = tm.track_id;