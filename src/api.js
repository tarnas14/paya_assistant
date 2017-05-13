import auth from './auth'

const apiEndpoint = process.env.REACT_APP_API

const getUserInfoFromQrCodeValue = async (qrCodeValue) => {
  // get /users/{guid}
  return {
    description: 'I\'m selling pizza',
    iconColor: '#080',
    name: 'Tom',
  }
}

const getBasicUserInfo = async () => {
  // get /profile
  return fetch(`${apiEndpoint}/profile?token=${auth.token()}`).then(response => response.json())
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
  return fetch(`${apiEndpoint}/profile/tips?token=${auth.token()}`).then(response => response.json())
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
