'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import Header from '../../components/layout/Header'
import { HeaderVariant } from '../../types/header'
import { useBackground } from '../../contexts/BackgroundContext'

export default function TermsPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${currentBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => router.back()}
                className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/15 hover:bg-white/15 transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/15">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Termos de Uso</h1>
                  <p className="text-white/70">Última atualização: Janeiro 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              
              <h2 className="text-2xl font-bold text-white mb-6">1. Aceitação dos Termos</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Ao acessar e usar a plataforma TrendlyAI, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Descrição do Serviço</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                A TrendlyAI é uma plataforma de inteligência artificial que oferece ferramentas, trilhas educacionais e recursos para criação de conteúdo digital e marketing. Nossos serviços incluem:
              </p>
              <ul className="text-white/80 mb-6 ml-6">
                <li className="mb-2">• Prompts e templates de IA otimizados</li>
                <li className="mb-2">• Trilhas de aprendizado estruturadas</li>
                <li className="mb-2">• Chat com assistente de IA (Salina)</li>
                <li className="mb-2">• Ferramentas de produtividade e criação</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Registro e Conta de Usuário</h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Para acessar determinados recursos, você deve criar uma conta fornecendo informações precisas e atualizadas. Você é responsável por:
              </p>
              <ul className="text-white/80 mb-6 ml-6">
                <li className="mb-2">• Manter a confidencialidade de sua senha</li>
                <li className="mb-2">• Notificar-nos sobre uso não autorizado de sua conta</li>
                <li className="mb-2">• Garantir que todas as informações fornecidas sejam verdadeiras</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Uso Aceitável</h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Você concorda em usar nossa plataforma apenas para fins legítimos. É proibido:
              </p>
              <ul className="text-white/80 mb-6 ml-6">
                <li className="mb-2">• Usar o serviço para atividades ilegais ou não autorizadas</li>
                <li className="mb-2">• Tentar acessar áreas restritas da plataforma</li>
                <li className="mb-2">• Compartilhar conteúdo ofensivo, difamatório ou prejudicial</li>
                <li className="mb-2">• Fazer engenharia reversa ou copiar nossos algoritmos</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Propriedade Intelectual</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens, prompts e software, é propriedade da TrendlyAI ou de seus licenciadores e está protegido por leis de direitos autorais.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Assinaturas e Pagamentos</h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Oferecemos diferentes planos de assinatura:
              </p>
              <ul className="text-white/80 mb-6 ml-6">
                <li className="mb-2">• Plano gratuito com funcionalidades limitadas</li>
                <li className="mb-2">• Planos pagos com recursos adicionais</li>
                <li className="mb-2">• Renovação automática salvo cancelamento</li>
                <li className="mb-2">• Política de reembolso de 7 dias</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Privacidade</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Sua privacidade é importante para nós. O uso de suas informações pessoais é regido por nossa Política de Privacidade, que faz parte integrante destes termos.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Limitação de Responsabilidade</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                A TrendlyAI não será responsável por danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou incapacidade de usar nossos serviços.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Modificações dos Termos</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas via email ou notificação na plataforma.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">10. Contato</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do email: suporte@trendlyai.com
              </p>

              <div className="border-t border-white/20 pt-6 mt-8">
                <p className="text-white/60 text-sm">
                  Última atualização: 11 de setembro de 2025
                  <br />
                  TrendlyAI © 2025. Todos os direitos reservados.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}