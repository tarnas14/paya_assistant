import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'

export default ({children, user, displayEmail = false}) => !user ? null : <Card style={{textAlign: 'start'}}>
  <CardHeader
    avatar={<Avatar backgroundColor={user.iconColor} />}
    title={user.name}
    subtitle={(displayEmail && user.email) || user.description || ''}
  />
  {displayEmail && user.description && <CardText>{user.description}</CardText>}
  {children}
</Card>
