// external imports
import React from 'react'
import { component, isNode, withChildren } from 'js-react-utils'
import { Spec } from 'js-spec'

// internal imports
import DataFormProps from './types/DataFormProps'
import DataFormCtrl from './ctrl/DataFormCtrl'
import DataFormView from './view/DataFormView'
import useForceUpdate from '../../../hooks/useForceUpdate'

// derived imports
const { useState } = React

// --- DataForm ------------------------------------------------------

const DataForm = component<DataFormProps>({
  displayName: 'DataForm',

  validate: Spec.checkProps({
    required: {
      title: Spec.string
    },

    optional: {
      actions:
        Spec.arrayOf(
          Spec.and(
            Spec.prop('type', Spec.oneOf('default')),
            Spec.or({
              when: Spec.prop('type', Spec.is('default')),

              then:
                Spec.exact({
                  type: Spec.is('default'),
                  text: Spec.string,
                  icon: Spec.optional(isNode)
                })
            }))),

      compact: Spec.boolean,
      onClose: Spec.function,
      children: withChildren(isNode)
    }
  }),

  render(props) {
    const
      forceUpdate = useForceUpdate(),

      [ctrl] = useState(() => {
        const ret = new DataFormCtrl
        
        ret.setValues({
          firstName: 'Jane',
          lastName: 'Doe',
          postalCode: '12345',
          city: 'New York',
          country: 'US'
        }, true)
        
        ret.subscribe(() => forceUpdate())

        return ret
      })

    /*
    ctrl.subscribe((values, tempValues) => {
      console.log('\n--- values ---')
      console.log(values)
      console.log('--- tempValues ---')
      console.log(tempValues)
    })
    */

    return DataFormView(props, ctrl)
  }
})

// --- exports -------------------------------------------------------

export default DataForm
