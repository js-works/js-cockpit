type FormSubmitDetail = {
  data: Record<string, string> | null
  rawData: Record<string, any> | null
}

export interface FormSubmitEvent extends CustomEvent<FormSubmitDetail> {
  type: 'c-form-submit'
}
