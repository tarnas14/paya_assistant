const getUserInfoFromQrCodeValue = async (qrCodeValue) => {
  // get /users/{guid}
  return {
    description: 'I\'m selling pizza',
    iconColor: '#080',
    name: 'Tom',
  }
}

const getBasicUserInfo = async token => {
  // get /profile
  return {
    description: 'I\'m eating pizza',
    email: 'jerry@tomAndJerry.com',
    guid: 'd4a027f1-809b-4cb7-890f-dc29aa077c3f',
    hasIncomingAccount: true,
    hasOutgoingAccount: true,
    iconColor: '#030',
    name: 'Jerry',
  }
}

const getProfileStats = async () => {
  // get /profile/stats
  return {
    given: {
      total: 40,
      given: 4,
      date: '2017-05-12',
    },
    received: {
      total: 5,
      received: 1,
      date: '2017-04-01'
    }}
}

const getHistory = async () => {
  // get /profile/tips (history)
  return {
    given: [
      {
        date: '2017-04-01',
        amount: '10',
        message: 'it was great john!',
        receipientName: 'John',
        receipientColor: '#000',
      },
      {
        date: '2017-04-02',
        amount: '5',
        message: 'it was great Mike!',
        receipientName: 'Mike',
        receipientColor: '#444',
      },
    ],
    received: [
      {
        date: '2017-04-03',
        amount: '21',
        message: 'thank you very much',
      },
      {
        date: '2017-04-04',
        amount: '1',
        message: 'we didn\'t like the service',
      },
      {
        date: '2017-04-04',
        amount: '39',
        message: 'i have a crush on you <3',
      },
    ]
  }
}

const giveTip = ({recipientGuid, amount, message}) => {
  // post /tips
  const tipPayload = {
    recipient_guid: recipientGuid,
    amount,
    message,
  }

  console.log('tip payload', tipPayload)
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo,
  getProfileStats,
  getHistory,
  giveTip,
}
