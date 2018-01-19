// @flow

export let store = {
  clicksCount: 0,
  matchCounter: 0,
  prevCardNode: undefined,
  currCardNode: undefined
}

export const setState = (newState: Object) => {
  store = { ...store, ...newState }

  return newState
}
