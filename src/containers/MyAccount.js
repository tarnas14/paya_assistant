import React, {Component} from 'react'
import User from '../components/User'
import Content from '../components/Content'
import {CardText, Card, CardHeader, CardActions} from 'material-ui/Card'
import {getProfileAccounts} from '../api'
import FlatButton from 'material-ui/FlatButton'
import Tick from 'material-ui/svg-icons/action/done'

export default class MyAccount extends Component {
  constructor () {
    super()
    this.state = {accounts: []}
  }

  async componentDidMount () {
     this.setState({accounts: await getProfileAccounts()})
  }

  render () {
    const {currentUser} = this.props
    if (!currentUser) {
      return null
    }

    const {accounts} = this.state

    return <div style={{maxWidth: '60%', margin: '0 auto'}}><Content>
      <User user={currentUser} displayEmail>
        <CardText>
          {accounts.map(account => <Card key={account.account.iban} style={{testAlign: 'right'}}>
              <CardHeader
                title={account.account.name}
                subtitle={account.bank.name}
                actAsExpander={true}
                showExpandableButton={true}
              /> 
              <CardText expandable={true}>{account.account.iban}</CardText>
              <CardActions>
                <FlatButton icon={currentUser.hasIncomingAccount && <Tick/>} disabled={currentUser.hasIncomingAccount} primary label="INCOMING" onClick={this.props.setIncoming.bind(undefined, {
                  bankId: account.bank.id,
                  accountId: account.account.id,
                  iban: account.account.iban
                })} />
                <FlatButton icon={currentUser.hasIncomingAccount && <Tick/>} disabled={currentUser.hasOutgoingAccount} secondary label="OUTGOING" onClick={this.props.setOutgoing.bind(undefined, {
                  bankId: account.bank.id,
                  accountId: account.account.id,
                  iban: account.account.iban
                })}/>
              </CardActions>
            </Card>
          )}
        </CardText>
      </User>
    </Content></div>
  }
}
