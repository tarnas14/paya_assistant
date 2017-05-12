import React from 'react'
import {Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'

export default ({user}) => !user ? null : <Card style={{textAlign: 'start'}}>
  <CardHeader
    avatar={<Avatar backgroundColor={user.iconColor} />}
    title={user.username}
    subtitle={user.description || user.email}
  />
</Card>
