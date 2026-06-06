import { MagnifyingGlass } from '@phosphor-icons/react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Text search box for filtering a list. Reused across views. */
export function SearchInput({ value, onChange, placeholder = 'Search…' }: Props) {
  return (
    <div className="relative w-full">
      <MagnifyingGlass
        size={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-3 pr-3 pl-10 text-neutral-100 outline-none focus:border-neutral-600"
      />
    </div>
  )
}
