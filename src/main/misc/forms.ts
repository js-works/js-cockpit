export type { FormControl };

type FormControl<T> = HTMLElement & {
  required: boolean;
  disabled: boolean;
  getFieldValue: () => T;
  validationMessage: string;
  errorText: string;
};
