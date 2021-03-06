export const Types = {
  EXPAND_SOCIALBAR: 'expandSocialBar',
  DISMISS_COMPONENT: 'dismissComponent',
}

export const ExpandSocialBar = () => ({
  type: Types.EXPAND_SOCIALBAR,
  payload: { },
})

export const DismissComponent = () => ({
  type: Types.DISMISS_COMPONENT,
  payload: { },
})

export const reducer = (state = false, action) => {
  switch (action.type) {
    case Types.EXPAND_SOCIALBAR: return true
    case Types.DISMISS_COMPONENT: return false
    default: return state
  }
}

