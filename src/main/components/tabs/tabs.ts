import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, createRef, lit, repeat, ref } from 'js-element/lit'
import {
  useAfterUpdate,
  useRefresher,
  useState,
  useStatus
} from 'js-element/hooks'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'
import SlTab from '@shoelace-style/shoelace/dist/components/tab/tab'
import SlTabGroup from '@shoelace-style/shoelace/dist/components/tab-group/tab-group'
import SlTabPanel from '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel'

// styles
import tabsStyles from './tabs.css'

// === exports =======================================================

export { Tabs }

// === Tabs ===================================================

@elem({
  tag: 'cp-tabs',
  styles: tabsStyles,
  uses: [SlIcon, SlTabGroup, SlTabPanel, SlTab],
  impl: lit(tabsImpl)
})
class Tabs extends component() {}

function tabsImpl(self: Tabs) {
  const status = useStatus()
  const refresh = useRefresher()
  const tabGroup = document.createElement('sl-tab-group')
  const tabGroupRef = createRef<SlTabGroup>()
  const slotRef = createRef<HTMLSlotElement>()

  const [state, setState] = useState({
    activeIdx: 0
  })

  const onTabChange = (ev: any) => {
    const newActiveIdx = parseInt(ev.detail.name.substr(5))

    if (newActiveIdx !== state.activeIdx) {
      setState('activeIdx', newActiveIdx)
    }
  }

  function render() {
    if (!status.hasUpdated()) {
      refresh()

      return html`
        <sl-tab-group ${ref(tabGroupRef)}></sl-tab-group>
        <slot ${ref(slotRef)}></slot>
      `
    } else {
      setTimeout(() => tabGroupRef.value!.show(`panel${state.activeIdx}`), 0)
    }

    const pages = slotRef
      .value!.assignedElements()
      .filter((it: any) => it.localName === 'cp-tab')
      .map((it: any) => ({ title: (it as any).title }))

    return html`
      <div class="base">
        <style>
          .pages slot::slotted(cp-tab:nth-of-type(${state.activeIdx + 1})) {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        </style>

        <sl-tab-group ${ref(tabGroupRef)} @sl-tab-show=${onTabChange}>
          ${repeat(
            pages,
            (_, idx) => idx,
            (page: any, idx) =>
              html`<sl-tab slot="nav" panel="panel${idx}"
                >${page.title}</sl-tab
              >`
          )}
        </sl-tab-group>
        <div class="pages"><slot ${ref(slotRef)}></slot></div>
      </div>
    `
  }

  return render
}
