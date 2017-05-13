import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {getHistory} from '../api'
import {Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import CenteredContent from '../components/Content'
import Loading from '../components/Loading'
import Money from '../components/Money'

const Content = ({children}) => <div style={{margin: '5px 15px 5px 15px', padding: '15px', position: 'relative'}}>{children}</div>

export default class TipHistory extends Component {
  constructor () {
    super()
    this.state = {
      tipsHistory: null
    }
  }

  async componentDidMount () {
    const tipsFromApi = await getHistory()

    const magic = tips => tips.map(tip => ({
      ...tip,
      date: new Date(tip.date.date)
    }))

    this.setState({tipsHistory: {
      given: magic(tipsFromApi.given),
      received: magic(tipsFromApi.received)
    }})
  }

  displayReceived = tip => {
    return  <Content key={`${tip.date}${tip.amount}`}>
      <Card>
        <CardHeader
          avatar={<Avatar backgroundColor={this.props.currentUser.iconColor} />}
          title={tip.date.toLocaleDateString()}
          subtitle={tip.message}
        >
          <p style={{position: 'absolute', right: '5%', top:'15%'}}>
            <Money val={tip.amount} />
          </p>
        </CardHeader>
      </Card>
    </Content>
  }

  displayGiven = tip => {
    return  <Content key={`${tip.date}${tip.amount}`}>

      <Card>
        <CardHeader
          avatar={<Avatar backgroundColor={tip.recipientColor} />}
          title={tip.recipientName || 'anonymous'}
          subtitle={tip.message}
        >
          <p style={{position: 'absolute', right: '5%', top:'15%'}}>
            <Money val={tip.amount}/>
          </p>
        </CardHeader>
      </Card>
    </Content>
  }

  render () {
    const {tipsHistory} = this.state

    if (!tipsHistory) {
      return <Loading />
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
