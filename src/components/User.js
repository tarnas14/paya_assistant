import React from 'react'
import {Card, CardHeader} from 'material-ui/Card';

export default ({user}) => !user ? null : <Card style={{textAlign: 'start'}}>
  <CardHeader
    avatar={user.avatar}
    title={user.username}
    subtitle={user.description || user.email}
  />
</Card>
