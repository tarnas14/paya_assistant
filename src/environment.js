export const defaultCommand = process.env.REACT_APP_SKIP_COMMANDS ? 0 : -1
export const speak = !Boolean(process.env.REACT_APP_SKIP_SPEECH)
