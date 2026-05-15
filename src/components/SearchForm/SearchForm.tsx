import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './SearchForm.module.css'

export type SearchFormProps = {
  formId: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function SearchForm({
  formId,
  value,
  placeholder = 'Search for products, brands and more',
  onChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <VisuallyHidden as="label" htmlFor={`${formId}-q`}>
        Search query
      </VisuallyHidden>
      <input
        id={`${formId}-q`}
        className={styles.input}
        type="search"
        name="q"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className={styles.submit}>
        Search
      </button>
    </form>
  )
}
