import { I18nController } from '../../i18n/i18n';

import {
  bind,
  createEmitter,
  elem,
  prop,
  Attrs,
  Component,
  Listener
} from '../../utils/components';

import { createRef, html, ref, repeat } from '../../utils/lit';

// events
import { PageChangeEvent } from '../../events/page-change-event';
import { PageSizeChangeEvent } from '../../events/page-size-change-event';

// custom elements
import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item';

// styles
import paginationBarStyles from './pagination-bar.css';

// icons
import chevronDoubleLeftSvg from '../../icons/chevron-double-left.svg';
import chevronLeftSvg from '../../icons/chevron-left.svg';
import chevronRightSvg from '../../icons/chevron-right.svg';
import chevronDoubleRightSvg from '../../icons/chevron-double-right.svg';

// === exports =======================================================

export { PaginationBar };

// === constants =====================================================

const pageSizes = new Set([25, 50, 100, 250, 500]);
const defaultPageSize = 50;

// === types =========================================================

type AuxData = {
  isValid: boolean;
  pageIndex: number;
  pageSize: number;
  totalItemCount: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstShownItemIndex: number;
  lastShownItemIndex: number;
  shownItemsCount: number;
};

// === Paginator =====================================================

@elem({
  tag: 'cp-pagination-bar',
  styles: paginationBarStyles,
  uses: [SlButton, SlIcon, SlInput, SlIconButton, SlMenuItem, SlSelect]
})
class PaginationBar extends Component {
  @prop({ attr: Attrs.number })
  pageIndex?: number;

  @prop({ attr: Attrs.number })
  pageSize?: number;

  @prop({ attr: Attrs.number })
  totalItemCount?: number;

  @prop({ attr: Attrs.boolean })
  disabled = false;

  @prop
  onPageChange?: Listener<PageChangeEvent>;

  @prop
  onPageSizeChange?: Listener<PageSizeChangeEvent>;

  reset() {
    this._pageInputRef.value!.value = this._auxData.isValid
      ? String(this._auxData.pageIndex)
      : '';

    this._pageSizeSelectRef.value!.value = String(
      this._auxData.isValid ? this._auxData.pageSize : defaultPageSize
    );
  }

  private _auxData!: AuxData;
  private _i18n = new I18nController(this);
  private _t = this._i18n.translate('jsCockpit.paginationBar');
  private _pageInputRef = createRef<SlInput>();
  private _pageSizeSelectRef = createRef<SlSelect>();

  private _emitPageChange = createEmitter(
    this,
    'c-page-change',
    () => this.onPageChange
  );

  private _emitPageSizeChange = createEmitter(
    this,
    'c-page-size-change',
    () => this.onPageSizeChange
  );

  @bind
  private _onFirstPageClick() {
    this._moveToPage(0);
  }

  @bind
  private _onPrevPageClick() {
    this._moveToPage(this._auxData.pageIndex - 1);
  }

  @bind
  private _onNextPageClick() {
    this._moveToPage(this._auxData.pageIndex + 1);
  }

  @bind
  private _onLastPageClick() {
    this._moveToPage(this._auxData.pageCount - 1);
  }

  @bind
  private _onPageFieldKeyPressed(ev: KeyboardEvent) {
    if (ev.key !== 'Enter') {
      return;
    }

    const pageNo = parseFloat(this._pageInputRef.value!.value);

    if (
      !Number.isInteger(pageNo) ||
      pageNo < 1 ||
      pageNo > this._auxData.pageCount
    ) {
      this._pageInputRef.value!.value = String(this._auxData.pageIndex + 1);
      return;
    }

    if (pageNo === this._auxData.pageIndex + 1) {
      return;
    }

    this._moveToPage(pageNo - 1);
  }

  @bind
  private _onPageSizeSelect(ev: Event) {
    const newPageSize = parseInt((ev.target as any).value);

    if (newPageSize !== this._auxData!.pageSize) {
      this._emitPageSizeChange({ pageSize: newPageSize });
    }
  }

  private _moveToPage(index: number) {
    this._emitPageChange({ pageIndex: index });
  }

  render() {
    this._auxData = this._getAuxData(
      this.pageIndex,
      this.pageSize,
      this.totalItemCount
    );

    return html`
      <div class="base">
        ${this._renderPagination()} ${this._renderPageSizeSelector()}
        ${this._renderPaginationInfo()}
      </div>
    `;
  }

  private _renderPagination() {
    if (!this._auxData.isValid) {
      return null;
    }

    const pageTxt = this._t('page');

    const ofXPagesTxt = this._t('ofXPages', {
      pageCount: this._auxData.pageCount
    });

    return html`
      <div class="pagination">
        <sl-button
          variant="default"
          class="nav-button"
          ?disabled=${this._auxData.isFirstPage}
          @click=${this._onFirstPageClick}
        >
          <sl-icon src=${chevronDoubleLeftSvg}></sl-icon>
        </sl-button>
        <sl-button
          variant="default"
          class="nav-button"
          ?disabled=${this._auxData.isFirstPage}
          @click=${this._onPrevPageClick}
        >
          <sl-icon src=${chevronLeftSvg}></sl-icon>
        </sl-button>
        <div class="page-control">
          ${pageTxt}
          <sl-input
            size="small"
            value=${this._auxData.pageIndex + 1}
            class="page-number-input"
            ?readonly=${this._auxData.pageCount === 1}
            @keypress=${this._onPageFieldKeyPressed}
            ${ref(this._pageInputRef)}
          ></sl-input>
          ${ofXPagesTxt}
        </div>
        <sl-button
          variant="default"
          class="nav-button"
          ?disabled=${this._auxData.isLastPage}
          @click=${this._onNextPageClick}
        >
          <sl-icon src=${chevronRightSvg}></sl-icon>
        </sl-button>
        <sl-button
          variant="default"
          class="nav-button"
          ?disabled=${this._auxData.isLastPage}
          @click=${this._onLastPageClick}
        >
          <sl-icon src=${chevronDoubleRightSvg}></sl-icon>
        </sl-button>
      </div>
    `;
  }

  private _renderPageSizeSelector() {
    if (!this._auxData.isValid) {
      return null;
    }

    return html`
      <div class="page-size-selector">
        ${this._t('pageSize')}
        <sl-select
          class="page-size-select"
          size="small"
          value=${this._auxData.pageSize}
          @sl-select=${this._onPageSizeSelect}
        >
          ${repeat(
            pageSizes,
            (idx) => idx,
            (pageSize) =>
              html`<sl-menu-item value=${pageSize}>${pageSize}</sl-menu-item>`
          )}
        </sl-select>
      </div>
    `;
  }

  private _renderPaginationInfo() {
    if (!this._auxData.isValid) {
      return null;
    }

    let info: String;

    info =
      this._t('itemsXToYOfZ', {
        firstItemNo: this._auxData.firstShownItemIndex,
        lastItemNo: this._auxData.lastShownItemIndex,
        itemCount: this._auxData.totalItemCount
      }) || '';

    return html`<div class="pagination-info">${info}</div>`;
  }

  private _getAuxData(
    pageIndex: number | undefined,
    pageSize: number | undefined,
    totalItemCount: number | undefined
  ): AuxData {
    const isValid =
      pageIndex !== undefined &&
      !isNaN(pageIndex) &&
      isFinite(pageIndex) &&
      Math.floor(pageIndex) === pageIndex &&
      pageIndex >= 0 &&
      pageSize !== undefined &&
      !isNaN(pageSize) &&
      isFinite(pageIndex) &&
      Math.floor(pageSize) === pageSize &&
      pageSize > 0 &&
      totalItemCount !== undefined &&
      !isNaN(totalItemCount) &&
      isFinite(totalItemCount) &&
      Math.floor(totalItemCount) === totalItemCount &&
      totalItemCount >= 0 &&
      pageIndex <= Math.ceil(totalItemCount / pageSize) - 1 &&
      pageSizes.has(pageSize);

    const pageCount = !isValid ? -1 : Math.ceil(totalItemCount! / pageSize!);

    return {
      isValid,
      pageIndex: isValid ? pageIndex : -1,
      pageSize: isValid ? pageSize : -1,
      totalItemCount: isValid ? totalItemCount : -1,
      pageCount,
      isFirstPage: isValid && pageIndex === 0,
      isLastPage: isValid && pageIndex === pageCount - 1,
      firstShownItemIndex: isValid ? pageIndex * pageSize + 1 : -1,

      lastShownItemIndex: isValid
        ? pageIndex < pageCount - 1
          ? (pageIndex + 1) * pageSize
          : totalItemCount
        : -1,

      shownItemsCount: isValid
        ? pageIndex < pageCount - 1
          ? pageSize
          : totalItemCount - pageIndex * pageSize
        : -1
    };
  }
}
