export const wait = async (delay = 100) => new Promise(resolve => {
  window.setTimeout(() => resolve(), delay)
})
