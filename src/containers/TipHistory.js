import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {getHistory} from '../api'
import {Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import CenteredContent from '../components/Content'
import Money from '../components/Money'

const Content = ({children}) => <div style={{margin: '20px', padding: '20px', position: 'relative'}}>{children}</div>

export default class TipHistory extends Component {
  constructor () {
    super()
    this.state = {
      tipsHistory: null
    }
  }

  async componentDidMount () {
    const tipsFromApi = await getHistory()

    const magic = tips => reverse(sortBy(tips.map(tip => ({
      ...tip,
      date: tip.date.date
    })), ['date']))

    this.setState({tipsHistory: {
      given: magic(tipsFromApi.given),
      received: magic(tipsFromApi.received)
    }})
  }

  displayReceived = tip => {
    return  <Content key={tip.date}>
      <p style={{position: 'absolute', right: '5%', fontWeight: 'bold', fontSize: '1.1em'}}>{(tip.amount/100).toFixed(2)} PLN</p>
      <Card>
      <CardHeader
        avatar={<Avatar backgroundColor={this.props.currentUser.iconColor} />}
        title={this.props.currentUser.name}
        subtitle={tip.message}
      />
    </Card></Content>
  }

  displayGiven = tip => {
    return  <Content key={tip.date}>
      <p style={{position: 'absolute', right: '5%', fontWeight: 'bold', fontSize: '1.1em'}}><Money val={tip.amount}/></p>
      <Card>
      <CardHeader
        avatar={<Avatar backgroundColor={tip.recipientColor} />}
        title={tip.recipientName || 'anonymous'}
        subtitle={tip.message}
      />
    </Card></Content>
  }

  render () {
    const {tipsHistory} = this.state

    if (!tipsHistory) {
      return <p>loading...</p>
    }

    return <Tabs>
      <Tab label="Received tips">
        {!Boolean(tipsHistory.received.length) && <CenteredContent><p>You haven't received any tips yet</p></CenteredContent>}
        {Boolean(tipsHistory.received.length) && tipsHistory.received.map(this.displayReceived)}
      </Tab>
      <Tab label="Given tips">
        {!Boolean(tipsHistory.given.length) && <CenteredContent><p>You haven't given any tips yet</p></CenteredContent>}
        {Boolean(tipsHistory.given.length) && tipsHistory.given.map(this.displayGiven)}
      </Tab>
    </Tabs>
  }
}
