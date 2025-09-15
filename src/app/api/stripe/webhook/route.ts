import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let payloadText = ''
  try {
    payloadText = await request.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(payloadText)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event?.type ?? 'unknown'
  const data = event?.data?.object ?? null
  const sig = request.headers.get('stripe-signature') || ''

  console.log('Stripe webhook received', {
    type,
    hasSignature: Boolean(sig),
    mode: process.env.NODE_ENV,
  })

  const supabase = getSupabaseAdmin() as any

  try {
    switch (type) {
      case 'customer.subscription.updated': {
        const subscriptionId = data?.id as string | undefined
        const status = data?.status as string | undefined
        const currentPeriodStart = data?.current_period_start
        const currentPeriodEnd = data?.current_period_end

        if (subscriptionId && status) {
          const { error } = await (supabase
            .from('subscriptions') as any)
            .update({
              status,
              current_period_start: currentPeriodStart
                ? new Date(currentPeriodStart * 1000).toISOString()
                : null,
              current_period_end: currentPeriodEnd
                ? new Date(currentPeriodEnd * 1000).toISOString()
                : null,
              stripe_subscription_id: subscriptionId,
            })
            .eq('stripe_subscription_id', subscriptionId)

          if (error) throw error
        }
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = data
        const amountPaid = invoice?.amount_paid
        const invoiceId = invoice?.id
        const createdTs = invoice?.created
        const invoicePdf = invoice?.invoice_pdf
        const receiptUrl = invoice?.receipt_url
        const subscriptionId = invoice?.subscription as string | undefined

        if (subscriptionId && amountPaid != null) {
          // map subscription -> user_id
          const { data: sub, error: subErr } = await (supabase
            .from('subscriptions') as any)
            .select('id,user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .single()
          if (subErr) throw subErr

          const { error } = await (supabase
            .from('billing_history') as any)
            .insert({
              user_id: sub.user_id,
              subscription_id: sub.id,
              stripe_invoice_id: invoiceId,
              amount_brl: amountPaid / 100,
              status: 'paid',
              billing_date: createdTs
                ? new Date(createdTs * 1000).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
              paid_at: new Date().toISOString(),
              description: 'Pagamento de assinatura',
              invoice_url: invoicePdf,
              receipt_url: receiptUrl,
            })
          if (error) throw error
        }
        break
      }
      default:
        // no-op for other events
        break
    }
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true, type })
}
