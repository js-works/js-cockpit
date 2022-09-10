import SlButton from '@shoelace-style/shoelace/dist/components/button/button';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input';
import { FocusTrap } from '@a11y/focus-trap';
import { Form } from '../components/form/form';
import { Message } from '../components/message/message';
import { TextField } from '../components/text-field/text-field';

import { html, render, TemplateResult } from 'lit';
import { I18nController } from '../i18n/i18n';
import { I18nFacade } from '../i18n/i18n';

// icons
import infoIcon from '../icons/info-circle.svg';
import warningIcon from '../icons/exclamation-circle.svg';
import errorIcon from '../icons/exclamation-triangle.svg';
import confirmationIcon from '../icons/question-circle.svg';
import approvalIcon from '../icons/question-diamond.svg';
import inputIcon from '../icons/keyboard.svg';
import customInputIcon from '../icons/card-text.svg';

// styles
import dialogStyles from './dialogs.styles';

// === exports =======================================================

export {
  showApproveDialog,
  showConfirmDialog,
  showErrorDialog,
  showCustomInputDialog,
  showInfoDialog,
  showInputDialog,
  showSuccessDialog,
  showWarnDialog
};

// required custom element (to prevent too much tree shaking)
void FocusTrap;

// === types =========================================================

type DialogConfig<T> = {
  type: 'normal' | 'success' | 'warning' | 'danger';
  icon: string;
  title: string;
  message: string;
  width?: string | null;
  minHeight?: string | null;

  buttons: {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    cancel?: true;
  }[];

  defaultResult?: T;
  content?: HTMLElement | null;
  mapResult?: (data: Record<string, any>, buttonIndex: number) => T;
};

// --- functions -----------------------------------------------------

function createDialogFn<P extends Record<string, unknown>, R = void>(
  logic: (parent: HTMLElement | null, params: P) => Promise<R>
): {
  (params: P): Promise<R>;
  (parent: HTMLElement | null, params: P): Promise<R>;
} {
  return (arg1: any, arg2?: any) =>
    arg2 && typeof arg2 === 'object' ? logic(arg1, arg2) : logic(null, arg1);
}

const showInfoDialog = createDialogFn<{
  message: string;
  title?: string;
  okText?: string;
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: infoIcon,
    title: params.title || translate('information'),
    message: params.message || '',

    buttons: [
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showSuccessDialog = createDialogFn<{
  message: string;
  title?: string;
  okText?: string;
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'success',
    icon: infoIcon,
    title: params.title || translate('information'),
    message: params.message || '',

    buttons: [
      {
        variant: 'success',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showWarnDialog = createDialogFn<{
  message: string;
  title?: string;
  okText?: string;
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'warning',
    icon: warningIcon,
    title: params.title || translate('warning'),
    message: params.message || '',

    buttons: [
      {
        variant: 'warning',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showErrorDialog = createDialogFn<{
  message: string;
  title?: string;
  okText?: string;
}>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'danger',
    icon: errorIcon,
    title: params.title || translate('error'),
    message: params.message || '',

    buttons: [
      {
        variant: 'danger',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showConfirmDialog = createDialogFn<
  {
    message: string;
    title?: string;
    okText?: string;
    cancelText?: string;
  },
  boolean
>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: confirmationIcon,
    title: params.title || translate('confirmation'),
    message: params.message || '',
    mapResult: (_, buttonIndex) => buttonIndex === 1,

    buttons: [
      {
        text: params.cancelText || translate('cancel'),
        cancel: true
      },
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showApproveDialog = createDialogFn<
  {
    message: string;
    title?: string;
    okText?: string;
    cancelText?: string;
  },
  boolean
>((parent, params) => {
  return showDialog(parent, (translate) => ({
    type: 'danger',
    icon: approvalIcon,
    title: params.title || translate('approval'),
    message: params.message || '',
    mapResult: (_, buttonIndex) => buttonIndex === 1,

    buttons: [
      {
        text: params.cancelText || translate('cancel'),
        cancel: true
      },
      {
        variant: 'danger',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showInputDialog = createDialogFn<
  {
    message: string;
    title?: string;
    okText?: string;
    cancelText?: string;
    value?: string;
  },
  string | null
>((parent, params) => {
  const inputField = document.createElement('cp-text-field');
  inputField.name = 'input';
  inputField.value = params.value || '';
  inputField.size = 'small';
  inputField.setAttribute('autofocus', '');

  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: inputIcon,
    title: params.title || translate('input'),
    message: params.message || '',
    content: inputField,
    defaultResult: null,
    mapResult: (data, buttonIndex) => (buttonIndex === 0 ? null : data.input),

    buttons: [
      {
        text: params.cancelText || translate('cancel'),
        cancel: true
      },
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

const showCustomInputDialog = createDialogFn<
  {
    content: TemplateResult;
    message?: string;
    title?: string;
    okText?: string;
    cancelText?: string;
    uses?: unknown[];
    width?: string | null;
    minHeight?: string | null;
  },
  Record<string, unknown> | null
>((parent, params) => {
  let container: HTMLElement | null = null;

  if (params.content) {
    container = document.createElement('div');
    container.attachShadow({ mode: 'open' });

    if (params.content instanceof HTMLElement) {
      container.append(params.content);
    } else if (params.content) {
      render(params.content, container.shadowRoot!);
    }
  }

  return showDialog(parent, (translate) => ({
    type: 'normal',
    icon: customInputIcon,
    title: params.title || translate('input'),
    message: params.message || '',
    content: container,
    width: params.width || null,
    minHeight: params.minHeight || null,
    mapResult: (data, buttonIndex) => (buttonIndex === 0 ? null : data),
    defaultResult: null,

    buttons: [
      {
        text: params.cancelText || translate('cancel'),
        cancel: true
      },
      {
        variant: 'primary',
        text: params.okText || translate('ok')
      }
    ]
  }));
});

function showDialog<T = void>(
  parent: HTMLElement | null,
  init: (
    translate: (
      textId: keyof Localize.Translations['jsCockpit.dialogs']
    ) => string
  ) => DialogConfig<T>
): Promise<T> {
  const target =
    parent ||
    document.querySelector('#app') ||
    document.querySelector('#root') ||
    document.body;

  const locale = new I18nController(target, null).getLocale();
  const i18n = new I18nFacade(() => locale);
  const translate = i18n.translate('jsCockpit.dialogs');

  const params = init(translate);
  const container = document.createElement('div');
  container.attachShadow({ mode: 'open' });
  const containerShadow = container.shadowRoot!;

  const setText = (text: string | undefined, selector: string) => {
    const target = containerShadow.querySelector<HTMLElement>(selector)!;

    if (text) {
      target.innerText = text;
    }
  };

  let buttonIndex = -1;

  // required custom elements
  void (
    Form ||
    Message ||
    TextField ||
    FocusTrap ||
    SlButton ||
    SlIcon ||
    SlDialog
  );

  render(
    html`
      <style></style>
      <style>
        sl-dialog::part(panel) {
          ${params.width ? `width: ${params.width};` : ''};
          ${params.minHeight ? `min-height: ${params.minHeight};` : ''};
        }
      </style>
      <cp-form class="form" dir=${i18n.getDirection()}>
        <focus-trap>
          <sl-dialog open class="dialog">
            <div slot="label" class="header">
              <sl-icon class="icon"></sl-icon>
              <div class="title"></div>
            </div>
            <div class="message"></div>
            <div class="content"></div>
            <div class="error-box">
              <cp-message variant="danger" class="error-message">
                ${i18n.translate('jsCockpit.validation', 'formInvalid')}
              </cp-message>
            </div>
            <div slot="footer" class="buttons"></div>
          </sl-dialog>
        </focus-trap>
      </cp-form>
    `,
    containerShadow
  );

  setText(params.title, '.title');
  setText(adjustMessage(params.message), '.message');

  const form = containerShadow.querySelector<HTMLFormElement>('cp-form.form')!;
  const dialog = containerShadow.querySelector<SlDialog>('sl-dialog.dialog')!;

  const errorBox = containerShadow.querySelector<Message>(
    'cp-message.error-message'
  )!;

  const contentBox =
    containerShadow.querySelector<HTMLDivElement>('div.content')!;

  if (params.content) {
    contentBox.prepend(params.content);
  }

  form.addEventListener('cp-form-submit', (ev) => {
    // This will be run before the button submit event is dispatched.
    // That's why the logic logic here will be deferred.

    setTimeout(() => {
      const data = ev.detail.data || {};
      dialog.hide();
      contentBox.removeEventListener('keydown', onKeyDown);
      buttonBox.removeEventListener('keydown', onKeyDown);
      emitResult(params.mapResult?.(data, buttonIndex));
      buttonIndex = -1;
    }, 0);
  });

  form.addEventListener('cp-form-invalid', (ev) => {
    if (!errorBox.open) {
      errorBox.open = true;
    } else {
      errorBox.vibrate();
    }
  });

  form.addEventListener('input', () => {
    errorBox.open = false;
  });

  dialog.addEventListener('sl-request-close', (ev: Event) => {
    ev.preventDefault();
    dialog.hide();
    emitResult(params.defaultResult);
  });

  const icon = containerShadow.querySelector<SlIcon>('sl-icon.icon')!;
  icon.classList.add(`${params.type}`);
  icon.src = params.icon;

  setText(dialogStyles.toString(), 'style');

  const buttonBox: HTMLElement = containerShadow.querySelector('.buttons')!;

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      dialog.hide();
      emitResult(params.defaultResult);
    }
  };

  contentBox.addEventListener('keydown', onKeyDown);
  buttonBox.addEventListener('keydown', onKeyDown);

  const hasPrimaryButton = params.buttons.some(
    (it) => it.variant === 'primary'
  );

  params.buttons.forEach(({ text, variant = 'default', cancel }, idx) => {
    const button: SlButton = document.createElement('sl-button');
    button.type = 'submit';
    button.className = 'button';
    button.variant = variant;
    button.innerText = text;

    if (variant === 'primary' || (!hasPrimaryButton && idx === 0)) {
      button.setAttribute('autofocus', '');
    }

    button.onclick = () => {
      if (cancel) {
        dialog.hide();
        emitResult(params.defaultResult);
      } else {
        buttonIndex = idx;
        form.submit();
      }
    };

    buttonBox.append(button);
  });

  (target.shadowRoot || target).appendChild(container);

  const elem = dialog.querySelector<HTMLElement>('[autofocus]');

  if (elem && typeof elem.focus === 'function') {
    setTimeout(() => elem.focus());
  }

  let emitResult: (result: any) => void;

  return new Promise((resolve) => {
    emitResult = (result: any) => {
      setTimeout(() => {
        (target.shadowRoot || target).removeChild(container);
        resolve(result);
      }, 200);
    };
  });
}

function adjustMessage(msg: string): string {
  return msg.replace(/^( +)/gm, (s1, s2) => '\u2007'.repeat(s1.length) + s2);
}
