import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import avatar from '../images/avatar.jpg'

export default ({children, user, displayEmail = false, displayDescription = false}) => !user ? null : <Card style={{textAlign: 'start'}}>
  <CardHeader
    avatar={<Avatar src={avatar} />}
    title={user.name}
    subtitle={(displayEmail && user.email) || (displayDescription && user.description) || ''}
  />
  {displayEmail && displayDescription && user.description && <CardText>{user.description}</CardText>}
  {children}
</Card>
