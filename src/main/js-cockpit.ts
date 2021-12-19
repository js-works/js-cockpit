import 'element-internals-polyfill'

// components
export { ActionBar } from './components/action-bar/action-bar'
export { AppLayout } from './components/app-layout/app-layout'
export { Brand } from './components/brand/brand'
export { Cockpit } from './components/cockpit/cockpit'
export { DataExplorer } from './components/data-explorer/data-explorer'
export { DataForm } from './components/data-form/data-form'
export { DataTable } from './components/data-table/data-table'
export { DateField } from './components/date-field/date-field'
export { DateRange } from './components/date-range/date-range'
export { EmailField } from './components/email-field/email-field'
export { Fieldset } from './components/fieldset/fieldset'
export { LoginForm } from './components/login-form/login-form'
export { PaginationBar } from './components/pagination-bar/pagination-bar'
export { PasswordField } from './components/password-field/password-field'
export { RadioGroup } from './components/radio-group/radio-group'
export { Section } from './components/section/section'
export { MessageBar } from './components/message-bar/message-bar'
export { NavMenu } from './components/nav-menu/nav-menu'
export { SelectBox } from './components/select-box/select-box'
export { SearchBox } from './components/search-box/search-box'
export { SideMenu } from './components/side-menu/side-menu'
export { Tab } from './components/tab/tab'
export { Tabs } from './components/tabs/tabs'
export { ThemeProvider } from './components/theme-provider/theme-provider'
export { TextArea } from './components/text-area/text-area'
export { TextField } from './components/text-field/text-field'
export { UserMenu } from './components/user-menu/user-menu'

// events
export { PageChangeEvent } from './events/page-change-event'
export { PageSizeChangeEvent } from './events/page-size-change-event'

// i18n
export { detectLocale, observeLocale } from './i18n/locale-detection'

// misc
export * from './misc/dialogs'
export * from './misc/theming'

// translations
import './misc/validation'
import './translations/de'
