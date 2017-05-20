import React from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default ({top = 40, left = 0}) => <RefreshIndicator
  size={40}
  left={left}
  top={top}
  status="loading"
  style={{
    display: 'inline-block',
    position: 'relative',
  }}
/>
