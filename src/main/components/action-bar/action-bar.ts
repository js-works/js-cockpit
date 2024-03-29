import { elem, prop, Attrs, Component } from '../../utils/components';
import { html, repeat, when } from '../../utils/lit';

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu';
import SlOption from '@shoelace-style/shoelace/dist/components/option/option';

// styles
import actionBarStyles from './action-bar.styles';

// === exports =======================================================

export { ActionBar };

// === types =========================================================

namespace ActionBar {
  export type Action = {
    kind: 'action';
    text: string;
    actionId: string;
    variant?: 'default' | 'primary';
    disabled?: boolean;
  };

  export type ActionGroup = {
    kind: 'action-group';
    text: string;
    actions: Action[];
    disabled?: boolean;
  };

  export type Actions = (Action | ActionGroup)[];
}

// === ActionBar =====================================================

@elem({
  tag: 'cp-action-bar',
  styles: actionBarStyles,
  uses: [SlButton, SlButtonGroup, SlDropdown, SlMenu, SlOption]
})
class ActionBar extends Component {
  @prop
  actions: ActionBar.Actions | null = null;

  @prop({ attr: Attrs.string })
  pill = false;

  render() {
    if (!this.actions) {
      return null;
    }

    return html`
      <div class="base">
        ${repeat(
          this.actions,
          (_, idx) => idx,
          (it, idx) => {
            if (it.kind === 'action') {
              return it.disabled
                ? null
                : html`
                    <sl-button
                      class="button"
                      variant=${it.variant || 'default'}
                      size="small"
                      ?disabled=${it.disabled}
                      ?pill=${this.pill}
                    >
                      ${it.text}
                    </sl-button>
                  `;
            } else {
              const disabled =
                !it.actions ||
                it.actions.length === 0 ||
                it.actions.every((it) => it.disabled);

              return disabled
                ? null
                : html`
                    <sl-dropdown class="button">
                      <sl-button
                        slot="trigger"
                        variant="default"
                        size="small"
                        caret
                        ?disabled=${disabled}
                        ?pill=${this.pill}
                      >
                        ${it.text}</sl-button
                      >
                      <sl-menu>
                        ${repeat(
                          it.actions,
                          (_, idx) => idx,
                          (it) => {
                            return html`
                              <sl-option ?disabled=${it.disabled}>
                                ${it.text}
                              </sl-option>
                            `;
                          }
                        )}
                      </sl-menu>
                    </sl-dropdown>
                  `;
            }
          }
        )}
      </div>
    `;
  }
}
