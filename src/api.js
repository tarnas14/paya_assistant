import auth from './auth'

const apiEndpoint = process.env.REACT_APP_API

const getUserInfoFromQrCodeValue = async (qrCodeValue) => {
  // get /users/{guid}
  return fetch(`${apiEndpoint}/users/${qrCodeValue}?token=${auth.token()}`).then(response => response.json())
}

const getBasicUserInfo = async () => {
  // get /profile
  return fetch(`${apiEndpoint}/profile?token=${auth.token()}`).then(response => response.json())
}

const getProfileStats = async () => {
  return fetch(`${apiEndpoint}/profile/stats?token=${auth.token()}`).then(response => response.json())
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
