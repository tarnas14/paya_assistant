import React from 'react'

export default ({val, currency='PLN'}) => <span>{(val/100).toFixed(2)} {currency}</span>
