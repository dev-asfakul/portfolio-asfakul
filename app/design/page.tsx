import { notFound } from 'next/navigation'
import { DesignReference } from '@/components/design/design-reference'

export default function DesignPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <DesignReference />
}
