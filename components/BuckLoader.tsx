import Buck from './Buck'

interface Props {
  label?: string
}

export default function BuckLoader({ label = 'Buck is on it…' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Buck size="md" animate />
      <p className="text-gold/60 text-sm font-medium">{label}</p>
    </div>
  )
}
