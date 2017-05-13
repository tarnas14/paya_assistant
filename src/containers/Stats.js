import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {getProfileStats} from '../api'
import {CardText, Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import CenteredContent from '../components/Content'
import Money from '../components/Money'
import Loyalty from 'material-ui/svg-icons/action/loyalty'

const Content = ({children}) => <div style={{margin: '20px', padding: '20px', position: 'relative'}}>{children}</div>

export default class Stats extends Component {
  constructor () {
    super()
    this.state = {
      stats: null
    }
  }

  async componentDidMount () {
    const tipsFromStats = await getProfileStats()

    const received = number => `You have been tipped ${number} ${number === 1 ? 'time' : 'times'}`
    const given = number => `You have tipped ${number} ${number === 1 ? 'time' : 'times'}`

    this.setState({stats: {
      given: tipsFromStats.given.map(s => ({...s, date: new Date(s.date.date), subtitle: given(s.numberOfGiven)})),
      received: tipsFromStats.received.map(s => ({...s, date: new Date(s.date.date), subtitle: received(s.numberOfReceived)})),
    }})
  }

  displayStats = (stat) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return <Content key={stat.date}>
      <h3>{months[stat.date.getMonth()]} {stat.date.getFullYear()}</h3>
      <Card>
        <CardHeader
          avatar={<Loyalty/>}
          title={<span style={{fontWeight: 'bold', fontSize: '1.1em'}}><Money val={stat.totalAmount}/></span>}
          subtitle={stat.subtitle}
        />
      </Card>
    </Content>
  }

  render () {
    const {stats} = this.state

    if (!stats) {
      return <p>loading...</p>
    }

    return <Tabs>
      <Tab label="Received tips">
        {!Boolean(stats.received.length) && <CenteredContent><p>You haven't received any tips yet</p></CenteredContent>}
        {Boolean(stats.received.length) && stats.received.map(this.displayStats)}
      </Tab>
      <Tab label="Given tips">
        {!Boolean(stats.given.length) && <CenteredContent><p>You haven't given any tips yet</p></CenteredContent>}
        {Boolean(stats.given.length) && stats.given.map(this.displayStats)}
      </Tab>
    </Tabs>
  }
}
