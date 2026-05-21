import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    console.error('Webhook signature verification failed:', message)
    return Response.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email

    if (!email) {
      console.error('No customer_email on completed session:', session.id)
      return Response.json({ received: true })
    }

    // Find auth user by email, then update their profile
    const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (listErr) {
      console.error('Failed to list users:', listErr.message)
      return Response.json({ error: 'Failed to look up user' }, { status: 500 })
    }

    const authUser = users.find((u) => u.email === email)
    if (!authUser) {
      console.error('No auth user found for email:', email)
      return Response.json({ received: true })
    }

    const { error: updateErr } = await supabaseAdmin
      .from('profiles')
      .update({ is_pro: true })
      .eq('id', authUser.id)

    if (updateErr) {
      console.error('Failed to set is_pro:', updateErr.message)
      return Response.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    console.log('Set is_pro=true for user:', authUser.id, email)
  }

  return Response.json({ received: true })
}
