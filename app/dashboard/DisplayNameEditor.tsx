'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function DisplayNameEditor({ initialName }: { initialName: string | null }) {
  const [name, setName] = useState(initialName ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const [saving, setSaving] = useState(false)

  const displayed = name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : null

  async function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ display_name: trimmed })
        .eq('id', user.id)
    }
    setName(trimmed)
    setEditing(false)
    setSaving(false)
  }

  function handleCancel() {
    setDraft(name)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <div className="mb-8">
      <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">
        Dashboard
      </p>

      {editing ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-3xl font-bold text-white whitespace-nowrap">Welcome back,</span>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={30}
            className="bg-white/10 border border-gold/60 focus:border-gold rounded-lg px-3 py-1 text-white text-2xl font-bold focus:outline-none w-44"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="text-sm font-semibold text-navy bg-gold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : displayed ? (
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {displayed}!
          </h1>
          <button
            onClick={() => { setDraft(name); setEditing(true) }}
            aria-label="Edit display name"
            className="text-white/40 hover:text-gold transition-colors"
          >
            <PencilIcon />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">Welcome!</h1>
          <button
            onClick={() => { setDraft(''); setEditing(true) }}
            className="text-gold font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            Set your name →
          </button>
        </div>
      )}
    </div>
  )
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
    </svg>
  )
}
