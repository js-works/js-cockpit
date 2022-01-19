import { h } from '../main/utils/dom'
import { elem } from 'js-element'
import { html, lit } from 'js-element/lit'
import { AppLayout, DataExplorer, ThemeProvider, Theme } from 'js-cockpit'
import { SharedDataExplorer } from './shared/shared-data-explorer'

export default {
  title: 'data-explorer'
}

void SharedDataExplorer

export const dataExplorer = () => h('shared-data-explorer')
