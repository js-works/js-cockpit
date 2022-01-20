type ActionDetail = {
  action: string
}

export interface ActionEvent extends CustomEvent<ActionDetail> {
  type: 'c-action'
}
