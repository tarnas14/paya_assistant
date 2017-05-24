import React from 'react'
import {CardText, Card} from 'material-ui/Card'
import Content from '../components/Content'

import {isSpeechAvailable} from '../speechApi'

export default ({children}) =>{
  if (!isSpeechAvailable()) {
    return <Content><Card>
      <CardText>Do korzystania z asystenta głosowego PAYA potrzebujesz przeglądarki <pre>Chrome w wersji 49+</pre> lub <pre>Chrome for Android w wersji 57+</pre>Za wszelkie utrudnienia przepraszamy i czekamy z niecierpliwością na obsługę w innych przeglądarkach<br/><p style={{textAlign: 'right'}}>RAJZA Team</p></CardText>
    </Card></Content>
  }

  return children
}
