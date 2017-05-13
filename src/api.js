import qs from 'qs'
import auth from './auth'

const apiEndpoint = process.env.REACT_APP_API

const getUserInfoFromQrCodeValue = async (qrCodeValue) => {
  // get /users/{guid}
  return fetch(`${apiEndpoint}/users/${qrCodeValue}?token=${auth.token()}`).then(response => response.json())
}

const getBasicUserInfo = async () => {
  // get /profile
  return fetch(`${apiEndpoint}/profile?token=${auth.token()}`).then(response => response.json()).catch(console.log)
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
    amount: amount * 100,
    message,
  }

  return fetch(
    `${apiEndpoint}/tips?token=${auth.token()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: qs.stringify(tipPayload)
    }
  ).then(response => response.json()).catch(error => alert(error))
}

export {
  getUserInfoFromQrCodeValue,
  getBasicUserInfo,
  getProfileStats,
  getHistory,
  giveTip,
}
