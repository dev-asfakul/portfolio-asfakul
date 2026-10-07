'use client'

import { useState, useTransition } from 'react'
import type { CollectionDef, FieldDef } from '@/lib/cms/registry'
import type { SaveResult } from '@/app/admin/actions'
import { saveEntry } from '@/app/admin/actions'

type RecordValue = Record<string, unknown>

function initialValue(field: FieldDef, record: RecordValue | null) {
  const value = record?.[field.name]
  if (value !== undefined) return value
  return field.defaultValue ?? (field.type === 'boolean' ? false : field.type === 'tags' || field.type === 'gallery' || field.type === 'multiselect' ? [] : '')
}

function serialize(field: FieldDef, value: unknown) {
  if (field.type === 'boolean') return Boolean(value)
  if (field.type === 'number') return value === '' ? '' : Number(value)
  if (field.type === 'tags' || field.type === 'multiselect') return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean)
  if (field.type === 'gallery') {
    return String(value ?? '').split('\n').map((url) => url.trim()).filter(Boolean).map((url) => ({ publicId: url, url }))
  }
  if (field.type === 'image') {
    const url = String(value ?? '').trim()
    return url ? { publicId: url, url } : null
  }
  return String(value ?? '')
}

export function CollectionEditor({ def, record, singleton = false }: { def: CollectionDef; record: RecordValue | null; singleton?: boolean }) {
  const [values, setValues] = useState<RecordValue>(() => Object.fromEntries(def.fields.map((field) => [field.name, initialValue(field, record)])))
  const [result, setResult] = useState<SaveResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function setValue(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      const payload = Object.fromEntries(def.fields.map((field) => {
        const value = values[field.name]
        if (field.type === 'tags' || field.type === 'multiselect') return [field.name, serialize(field, Array.isArray(value) ? value.join(',') : value)]
        return [field.name, serialize(field, value)]
      }))
      setResult(await saveEntry(def.key, singleton ? null : (record?.id as string | undefined) ?? null, payload))
    })
  }

  return (
    <form className="admin-editor" onSubmit={submit}>
      <div className="admin-editor-grid">
        {def.fields.map((field) => {
          const value = values[field.name]
          if (field.type === 'boolean') return <label key={field.name} className="admin-check"><input type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(field.name, event.target.checked)} /> <span>{field.label}</span></label>
          if (field.type === 'select' || field.type === 'multiselect') return <label key={field.name} className="admin-field"><span className="meta">{field.label}</span><select multiple={field.type === 'multiselect'} value={field.type === 'multiselect' ? (Array.isArray(value) ? value : []) : String(value ?? '')} onChange={(event) => setValue(field.name, field.type === 'multiselect' ? Array.from(event.currentTarget.selectedOptions, (option) => option.value) : event.currentTarget.value)}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          return <label key={field.name} className={`admin-field ${field.span === 'full' || field.type === 'longtext' ? 'admin-field-full' : ''}`}><span className="meta">{field.label}{field.required ? ' *' : ''}</span>{field.type === 'textarea' || field.type === 'longtext' ? <textarea rows={field.type === 'longtext' ? 10 : 4} value={String(value ?? '')} onChange={(event) => setValue(field.name, event.target.value)} placeholder={field.placeholder} /> : <input type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'} value={Array.isArray(value) ? value.join(', ') : String(value ?? '')} onChange={(event) => setValue(field.name, event.target.value)} placeholder={field.placeholder} />}</label>
        })}
      </div>
      <div className="admin-editor-actions"><button className="admin-submit" type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save changes ↗'}</button>{result && <p className={result.ok ? 'text-accent' : 'text-destructive'}>{result.ok ? 'Saved.' : result.error}</p>}</div>
    </form>
  )
}
