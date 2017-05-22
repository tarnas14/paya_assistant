import React from 'react'
import './MySnackbar.css'

export default ({open, message}) => {
  if (!open) {
    return null
  }

  return <div className='MySnackbar'>
    {message}
  </div>
}
