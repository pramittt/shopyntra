export interface ISearchFormProps {
  formId: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onSubmit: () => void
}
