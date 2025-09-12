# TrendlyAI - Estrutura Completa do Banco de Dados

## 📊 TABELAS E COLUNAS DETALHADAS

### 1. conversations
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| title | text | Título da conversa |
| conversation_summary | text | Resumo da conversa |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 2. messages
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| conversation_id | uuid | Foreign Key → conversations(id) |
| role | text | 'user', 'assistant', 'system' |
| content | text | Conteúdo da mensagem |
| openai_response_id | text | ID da resposta OpenAI |
| structured_data | jsonb | Dados estruturados |
| reasoning_actions | jsonb | Ações de raciocínio |
| content_type | text | Tipo do conteúdo |
| created_at | timestamptz | Data de criação |
| credit_usage | int4 | Uso de créditos |
| user_type_of_time | text | Tipo de tempo do usuário |

### 3. payment_history
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| subscription_id | uuid | ID da assinatura |
| stripe_payment_inte... | text | ID do payment intent Stripe |
| amount | int4 | Valor em centavos |
| currency | text | Moeda (BRL) |
| status | text | Status do pagamento |
| payment_method | text | Método de pagamento |
| receipt_url | text | URL do recibo |
| created_at | timestamptz | Data de criação |

### 4. prices
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | text | Primary Key (Stripe Price ID) |
| product_id | text | Foreign Key → products(id) |
| active | bool | Se o preço está ativo |
| description | text | Descrição do preço |
| unit_amount | int8 | Valor unitário |
| currency | text | Moeda |
| type | text | Tipo de preço |
| interval | text | Intervalo (mensal/anual) |
| interval_count | int4 | Contagem do intervalo |
| trial_period_days | int4 | Dias de período de trial |
| metadata | jsonb | Metadados do Stripe |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 5. products
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | text | Primary Key (Stripe Product ID) |
| active | bool | Se o produto está ativo |
| name | text | Nome do produto |
| description | text | Descrição |
| image | text | URL da imagem |
| metadata | jsonb | Metadados do Stripe |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 6. profiles
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key → auth.users(id) |
| email | text | Email do usuário |
| display_name | text | Nome de exibição |
| avatar_url | text | URL do avatar |
| bio | text | Biografia |
| level | text | Nível do usuário |
| streak_days | int4 | Dias de streak |
| total_tracks | int4 | Total de trilhas |
| completed_modules | int4 | Módulos completados |
| credits | int4 | Créditos atuais |
| max_credits | int4 | Máximo de créditos |
| metadata | jsonb | Metadados flexíveis |
| preferences | jsonb | Preferências do usuário |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |
| credits_cycle_start | timestamptz | Início do ciclo de créditos |
| credits_used_this_cy... | int4 | Créditos usados no ciclo atual |
| subscription_status | text | Status da assinatura |
| subscription_type | text | Tipo de assinatura |
| interval_type | text | Tipo de intervalo |
| interval_count | int4 | Contagem do intervalo |
| trial_period_days | int4 | Dias de trial |
| is_active | bool | Se está ativo |

### 7. subscriptions
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| stripe_subscription_id | text | ID da assinatura Stripe |
| stripe_customer_id | text | ID do cliente Stripe |
| price_id | uuid | Foreign Key → prices(id) |
| status | text | Status da assinatura |
| current_period_start | timestamptz | Início do período atual |
| current_period_end | timestamptz | Fim do período atual |
| cancel_at_period_end | bool | Cancelar no fim do período |
| canceled_at | timestamptz | Data de cancelamento |
| trial_start | timestamptz | Início do trial |
| trial_end | timestamptz | Fim do trial |
| metadata | jsonb | Metadados |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 8. tools
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| name | text | Nome da ferramenta |
| description | text | Descrição |
| category | text | Categoria |
| icon | text | Ícone |
| configuration | jsonb | Configuração |
| is_active | bool | Se está ativo |
| requires_premium | bool | Requer premium |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |
| content | text | Conteúdo |
| original_content | text | Conteúdo original |
| created_by | text | Criado por |
| quick_guide | text | Guia rápido |
| ai_recommendations | jsonb | Recomendações IA |
| tags | _text | Array de tags |

### 9. track_reviews
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| track_id | uuid | Foreign Key → tracks(id) |
| rating | int4 | Avaliação (1-5) |
| comment | text | Comentário |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 10. tracks
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| title | text | Título da trilha |
| description | text | Descrição |
| content | jsonb | Conteúdo estruturado |
| background_image | text | Imagem de fundo |
| difficulty | text | Nível de dificuldade |
| is_published | bool | Se está publicado |
| tags | _text | Array de tags |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |
| requires_premium | bool | Requer premium |

### 11. track_modules
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| track_id | uuid | Foreign Key → tracks(id) |
| title | text | Título do módulo |
| content | jsonb | Conteúdo estruturado |
| order_index | int4 | Ordem do módulo |
| video_url | text | URL do vídeo |
| tools | jsonb | Ferramentas relacionadas |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 12. user_module_progress
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| track_id | uuid | Foreign Key → tracks(id) |
| module_id | uuid | Foreign Key → track_modules(id) |
| completed | bool | Se foi completado |
| completed_at | timestamptz | Data de conclusão |
| created_at | timestamptz | Data de criação |

### 13. user_referrals
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| referral_code | varchar(20) | Código de referral |
| total_credits | int4 | Total de créditos |
| total_referrals | int4 | Total de referrals |
| pending_credits | int4 | Créditos pendentes |
| affiliate_earnings | numeric(10,2) | Ganhos de afiliado |
| is_affiliate_eligible | bool | Elegível para afiliado |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Data de atualização |

### 14. user_tools
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| tool_id | uuid | Foreign Key → tools(id) |
| is_favorite | bool | Se é favorito |
| last_used | timestamptz | Última vez usado |
| usage_count | int4 | Contador de uso |
| created_at | timestamptz | Data de criação |
| custom_content | text | Conteúdo customizado |
| is_archived | bool | Se está arquivado |

### 15. user_tracks
| Coluna | Tipo | Observações |
|--------|------|-------------|
| id | uuid | Primary Key |
| user_id | uuid | Foreign Key → profiles(id) |
| track_id | uuid | Foreign Key → tracks(id) |
| progress | int4 | Progresso (0-100) |
| status | text | Status da trilha |
| started_at | timestamptz | Data de início |
| completed_at | timestamptz | Data de conclusão |
| last_accessed | timestamptz | Último acesso |
| is_favorite | bool | Se é favorito |

## 📈 RELACIONAMENTOS PRINCIPAIS

### Relacionamentos de Usuário (profiles como centro)
```
profiles (1) ←→ (N) conversations
profiles (1) ←→ (N) user_tracks
profiles (1) ←→ (N) user_tools
profiles (1) ←→ (N) user_module_progress
profiles (1) ←→ (N) track_reviews
profiles (1) ←→ (1) user_referrals
profiles (1) ←→ (N) subscriptions
profiles (1) ←→ (N) payment_history
```

### Relacionamentos de Conteúdo
```
tracks (1) ←→ (N) track_modules
tracks (1) ←→ (N) user_tracks
tracks (1) ←→ (N) track_reviews
conversations (1) ←→ (N) messages
```

### Relacionamentos Stripe
```
products (1) ←→ (N) prices
prices (1) ←→ (N) subscriptions
```

## 🔍 ÍNDICES IDENTIFICADOS

### Índices de Performance
- Todas as foreign keys têm índices automáticos
- Campos de timestamp (created_at, updated_at) indexados
- Campos de status e boolean para filtering
- user_id indexado em todas as tabelas de relacionamento