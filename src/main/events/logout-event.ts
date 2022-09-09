export namespace LogoutEvent {
  export type Type = 'cp-logout';
}

export interface LogoutEvent extends CustomEvent<null> {
  type: LogoutEvent.Type;
}

declare global {
  interface HTMLElementEventMap extends Record<LogoutEvent.Type, LogoutEvent> {}
}
