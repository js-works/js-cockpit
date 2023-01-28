import { elem, Component } from '../main/utils/components';
import { html } from '../main/utils/lit';
import { h } from '../main/utils/dom';
import { SharedDataExplorer } from './shared/shared-data-explorer';

export default {
  title: 'data-explorer'
};

void SharedDataExplorer;

export const dataExplorer = () => h('shared-data-explorer');
