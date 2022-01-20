type ActionDetail = {
  actionId: string
}

export interface ActionEvent extends CustomEvent<ActionDetail> {
  type: 'c-action'
}
