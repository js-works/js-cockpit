import { h } from '../main/utils/dom'
import { component, elem } from 'js-element'
import { html, withLit } from 'js-element/lit'
import { AppLayout } from '../main/components/app-layout/app-layout'

export default {
  title: 'app-layout'
}

import theme from '@shoelace-style/shoelace/dist/themes/light.styles'
const themeStyles = theme.toString()

@elem({
  tag: 'app-layout-demo',
  styles: [themeStyles],
  uses: [AppLayout],
  impl: withLit(appLayoutDemoImpl)
})
class AppLayoutDemo extends component() {}

function appLayoutDemoImpl() {
  return () => html`
    <sx-app-layout>
      <div slot="header-start">header-start</div>
      <div slot="header">header</div>
      <div slot="header-end">header-end</div>
      <div slot="subheader-start">subheader-start</div>
      <div slot="subheader">subheader</div>
      <div slot="subheader-end">subheader-end</div>
      <div slot="sidebar-start">sidebar-start</div>
      <div slot="sidebar">sidebar</div>
      <div slot="sidebar-end">sidebar-end</div>
      <div slot="main-start">main-start</div>
      <div slot="main">main</div>
      <div slot="main-end">main-end</div>
      <div slot="sidebar2-start">sidebar2-start</div>
      <div slot="sidebar2">sidebar2</div>
      <div slot="sidebar2-end">sidebar2-end</div>
    </sx-app-layout>
  `
}

export const appLayout = () => h('app-layout-demo')
