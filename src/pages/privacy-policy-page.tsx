import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { Button } from "@/components/ui/button"

/**
 * Portuguese-only: this is the shop's legal notice for its (Portugal-based)
 * customers, not a customer-facing feature that needs the app's 5-language i18n.
 */
export function PrivacyPolicyPage() {
  return (
    <div className="min-h-svh bg-[var(--color-canvas)]">
      <CustomerHeader />
      <main className="mx-auto max-w-[680px] px-6 pb-20 pt-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Button>
        </Link>

        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[var(--color-ink-950)]">Política de Privacidade</h1>
        <p className="mt-1 text-[12.5px] text-[var(--color-ink-400)]">Última atualização: 27 de agosto de 2026</p>

        <div className="mt-8 flex flex-col gap-6 text-[14px] leading-relaxed text-[var(--color-ink-700)]">
          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">1. Quem somos</h2>
            <p>
              A WD PDR (Wan Diego – Paintless Dent Removal) é uma oficina especializada em reparação de mossas sem
              pintura, com sede em Rua Santo André, Edifício Europa, Lote 4 – Escritório 5, 2410-541 Leiria, Portugal.
              Para qualquer questão sobre os seus dados pessoais, pode contactar-nos por email em{" "}
              <a href="mailto:wd.pdr@gmail.com" className="text-[var(--color-amber-700)] underline underline-offset-2">
                wd.pdr@gmail.com
              </a>{" "}
              ou por telefone em{" "}
              <a href="tel:+351936077121" className="text-[var(--color-amber-700)] underline underline-offset-2">
                +351 936 077 121
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">2. Que dados recolhemos</h2>
            <p>Quando pede um orçamento através deste site, recolhemos:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nome</li>
              <li>Número de telefone</li>
              <li>Email (opcional)</li>
              <li>Matrícula do veículo (opcional)</li>
              <li>Observações que escreva sobre o pedido</li>
              <li>Informação sobre os danos indicados no veículo (localização, tipo e gravidade)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">3. Para que usamos os seus dados</h2>
            <p>
              Usamos estes dados exclusivamente para preparar o orçamento, entrar em contacto consigo sobre o seu
              pedido, e gerir o histórico de clientes e orçamentos da oficina. Não vendemos nem partilhamos os seus
              dados com terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">4. Onde ficam guardados os seus dados</h2>
            <p>
              Atualmente, os dados dos pedidos de orçamento são guardados localmente no navegador utilizado pela
              equipa da WD PDR para gerir os pedidos, e não são enviados para nenhum servidor externo ou base de
              dados na nuvem.
            </p>
          </section>

          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">5. Os seus direitos</h2>
            <p>
              Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), tem o direito de aceder, corrigir ou
              solicitar a eliminação dos seus dados pessoais a qualquer momento. Para exercer estes direitos, contacte-nos
              através dos meios indicados no ponto 1.
            </p>
          </section>

          <section>
            <h2 className="mb-1.5 text-[15px] font-semibold text-[var(--color-ink-950)]">6. Cookies</h2>
            <p>Este site não utiliza cookies de rastreamento ou de publicidade.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
