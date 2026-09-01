/**
 * Mantém o projeto Supabase acordado.
 *
 * PORQUÊ: projetos no plano grátis do Supabase são pausados automaticamente ao fim
 * de 7 dias com pouca atividade. Se isso acontecer numa semana fraca da oficina, o
 * cliente final marca os danos, carrega em enviar e leva um erro — e o dono só
 * descobre quando alguém se queixar. A documentação do Supabase indica gerar
 * atividade por chamadas à API como forma válida de evitar a pausa.
 *
 * Corre uma vez por dia por cron do Vercel (ver `crons` em vercel.json).
 *
 * NÃO substitui o plano Pro. Quando a oficina começar a receber pedidos a sério,
 * o projeto deve passar a pago — aí nem pausa, nem depende disto.
 */

const TIMEOUT_MS = 10_000

interface Resultado {
  ok: boolean
  verificado: string
  detalhe: string
}

async function tocarNaBaseDeDados(url: string, chave: string): Promise<Resultado> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    // Leitura mínima e pública: as definições da oficina. Uma linha, sem dados
    // pessoais, e é a única tabela que o papel anon consegue ler.
    const resposta = await fetch(`${url}/rest/v1/shop_settings?select=id&limit=1`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` },
      signal: controller.signal,
    })

    if (!resposta.ok) {
      return {
        ok: false,
        verificado: new Date().toISOString(),
        detalhe: `Supabase respondeu ${resposta.status} ${resposta.statusText}`,
      }
    }

    return { ok: true, verificado: new Date().toISOString(), detalhe: "base de dados acordada" }
  } catch (erro) {
    const causa = erro instanceof Error ? erro.message : String(erro)
    return {
      ok: false,
      verificado: new Date().toISOString(),
      detalhe: causa.includes("abort") ? `sem resposta em ${TIMEOUT_MS}ms` : causa,
    }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Avisa que o ping falhou. Sem RESEND_API_KEY configurada não faz nada — de
 * propósito, para o ping funcionar antes de existir serviço de email.
 * Um alerta que falha em silêncio é pior do que não ter alerta, por isso o
 * estado fica sempre no corpo da resposta e nos logs do Vercel.
 */
async function avisarFalha(detalhe: string): Promise<string> {
  const chave = process.env.RESEND_API_KEY
  const para = process.env.ALERTA_EMAIL_TO
  const de = process.env.ALERTA_EMAIL_FROM

  if (!chave || !para || !de) return "alerta por email não configurado"

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: de,
        to: para,
        subject: "[WD PDR] A base de dados não respondeu",
        text:
          `O ping diário à base de dados falhou.\n\n${detalhe}\n\n` +
          `Se o projeto Supabase estiver pausado, o site continua a mostrar preços mas ` +
          `os pedidos dos clientes NÃO chegam à oficina.\n\n` +
          `Verificar em: https://supabase.com/dashboard`,
      }),
    })
    return r.ok ? "alerta enviado" : `alerta falhou (${r.status})`
  } catch {
    return "alerta falhou (erro de rede)"
  }
}

export async function GET() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const chave =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !chave) {
    // 500 de propósito: o cron aparece como falhado no painel do Vercel em vez
    // de dar a falsa sensação de estar a correr bem sem fazer nada.
    return Response.json(
      { ok: false, detalhe: "VITE_SUPABASE_URL ou a chave publicável não estão definidas" },
      { status: 500 }
    )
  }

  const resultado = await tocarNaBaseDeDados(url, chave)

  if (!resultado.ok) {
    const alerta = await avisarFalha(resultado.detalhe)
    console.error("[keep-alive] FALHOU:", resultado.detalhe, "|", alerta)
    return Response.json({ ...resultado, alerta }, { status: 500 })
  }

  console.log("[keep-alive] ok:", resultado.verificado)
  return Response.json(resultado)
}
