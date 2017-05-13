import React from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'

export default () => <RefreshIndicator
  size={40}
  left={0}
  top={40}
  status="loading"
  style={{
    display: 'inline-block',
    position: 'relative',
  }}
/>
