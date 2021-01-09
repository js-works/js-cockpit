import { h, defineElement } from '../../utils/dom'

export const DateField = createDateFieldClass({
  name: 'sx-date-field'
})

// === types =========================================================

type DateFieldConfig = {
  name: `${string}-${string}`
}
type CalendarParams = {
  date?: Date
  firstDayOfWeek?: number
  showWeekNumbers?: boolean
}

// === createDateFieldClass ==========================================

function createDateFieldClass(
  config: DateFieldConfig
): CustomElementConstructor {
  class DateField extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })

      this.connectedCallback = () => {
        const styleElem = h('style', null, calendarStyles)
        this.shadowRoot!.appendChild(styleElem)
        refresh()
      }
  
      const refresh = () => {
        const root = this.shadowRoot!
        const calendar = renderCalendar({
          date: new Date()
        })

        if (root.children.length > 1) {
          root.removeChild(root.children[1])
        }
        root.appendChild(calendar)
      }
    }
    connectedCallback() {
      this.connectedCallback()
    }
  }
  return DateField
}
// === date utils ====================================================
// === misc ==========================================================
function renderCalendar({
  date = new Date(),
  firstDayOfWeek = 0,
  showWeekNumbers = true
}: CalendarParams): Node {
  const headRow: Node[] = []
  const rows: Node[] = []
  for (let rowIdx = 0; rowIdx < 6; ++rowIdx) {
    const cols: Node[] = []
    for (let colIdx = 0; colIdx < 7 + Number(showWeekNumbers); ++colIdx) {
      cols.push(h('td', null, rowIdx + ':' + colIdx))
    }
    rows.push(h('tr', null, cols))
  }
  const table = h(
    'table',
    null,
    h('thead', null, headRow),
    h('tbody', null, rows)
  )
  return h('div', null, table)
}
// === styles ========================================================
const calendarStyles = `
`