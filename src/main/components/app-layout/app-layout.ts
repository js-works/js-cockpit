import { component, elem, prop, setMethods, Attrs } from 'js-element'
import { html, classMap, withLit } from 'js-element/lit'

// custom elements
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon'

// styles
import appLayoutStyles from './app-layout.css'

// === exports =======================================================

export { AppLayout }

// === Cockpit ===================================================

@elem({
  tag: 'jsc-app-layout',
  styles: appLayoutStyles,
  impl: withLit(appLayoutImpl)
})
class AppLayout extends component() {
  @prop({ attr: Attrs.string })
  logo = ''

  @prop({ attr: Attrs.string })
  vendor = ''

  @prop({ attr: Attrs.string })
  title = ''

  @prop({ attr: Attrs.string })
  size: 'small' | 'medium' | 'large' | 'huge' = 'medium'

  @prop({ attr: Attrs.boolean })
  multiColor = false
}

function appLayoutImpl(self: AppLayout) {
  return () => html`
    <div class="base">
      <div class="row1">
        <div class="header-start">
          <slot name="header-start"></slot>
        </div>
        <div class="header">
          <slot name="header"></slot>
        </div>
        <div class="header-end">
          <slot name="header-end"></slot>
        </div>
      </div>
      <div class="row2">
        <div class="subheader-start">
          <slot name="subheader-start"></slot>
        </div>
        <div class="subheader">
          <slot name="subheader"></slot>
        </div>
        <div class="subheader-end">
          <slot name="subheader-end"></slot>
        </div>
      </div>
      <div class="col1">
        <div class="sidebar-start">
          <slot name="sidebar-start"></slot>
        </div>
        <div class="sidebar">
          <slot name="sidebar"></slot>
        </div>
        <div class="sidebar-end">
          <slot name="sidebar-end"></slot>
        </div>
      </div>
      <div class="col2">
        <div class="main-start">
          <slot name="main-start"></slot>
        </div>
        <div class="main">
          <slot name="main"></slot>
        </div>
        <div class="main-end">
          <slot name="main-end"></slot>
        </div>
      </div>
      <div class="col3">
        <div class="sidebar2-start">
          <slot name="sidebar2-start"></slot>
        </div>
        <div class="sidebar2">
          <slot name="sidebar2"></slot>
        </div>
        <div class="sidebar2-end">
          <slot name="sidebar2-end"></slot>
        </div>
      </div>
      <div class="row3">
        <div class="footer-start">
          <slot name="footer-start"></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
        <div class="footer-end">
          <slot name="footer-end"></slot>
        </div>
      </div>
    </div>
  `
}
