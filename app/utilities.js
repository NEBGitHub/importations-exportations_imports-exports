import TR from './TranslationTable'

const numLocale = (v, decimals = 2) => v.toLocaleString(undefined, { maximumFractionDigits: decimals })
export const humanNumber = (valueRaw, language, maxCharacters = 4) => {
  if (numLocale(valueRaw).length <= maxCharacters) { return numLocale(valueRaw) }
  let value = valueRaw
  let valueScale = 0
  while (numLocale(value, 0).length > maxCharacters && value >= 1000) {
    value /= 1000
    valueScale += 1
  }
  return `${numLocale(value)}${TR.getIn(['formatNumberUnit', language, valueScale])}`
}

export const handleInteraction = (func, ...boundArgs) => {
  const handle = (e) => {
    if (e.type === 'click') {
      e.preventDefault()
      e.stopPropagation()
      func(...boundArgs)
    } else if (e.type === 'keypress') {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        func(...boundArgs)
      }
    }
  }
  return {
    onClick: handle, onKeyPress: handle, onKeyDown: handle, tabIndex: 0, focusable: 'true',
  }
}

export const handleInteractionWithTabIndex = (tabIndex, func, ...boundArgs) => {
  const event = handleInteraction(func, ...boundArgs)
  event.tabIndex = tabIndex
  return event
}
