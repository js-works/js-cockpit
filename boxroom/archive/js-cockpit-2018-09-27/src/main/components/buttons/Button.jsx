import React from 'react';
import { defineComponent } from 'js-scenery/react';
import { DefaultButton, CommandBarButton } from 'office-ui-fabric-react';

export default defineComponent({
  displayName: 'Button',

  properties: {
    text: {
      type: String,
      nullable: true,
      defaultValue: null
    },

    className: {
      type: String,
      nullable: true,
      defaultValue: null
    },

    style: {
      type: Object,
      nullable: true,
      defaultValue: null
    }
  },

  render(props) {
    return <CommandBarButton style={{ padding: 0 }}>xxxyy</CommandBarButton>;
  }
});
