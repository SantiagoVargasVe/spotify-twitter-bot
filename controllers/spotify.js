const fetch = require('node-fetch')
const {URL, URLSearchParams} = require('url')
const LocalStorage = require('node-localstorage').LocalStorage
const btoa = require('btoa')
const saveTokens = async (authorizationCode) => {
  let bodyData = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: 'http://localhost:7000/spotify/home',
    client_id: process.env.CLIEND_ID_SPOTIFY,
    client_secret: process.env.CLIENT_SECRET_SPOTIFY
  }

  let response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(bodyData)
  })

  let tokens = await response.json()

  let localStorage = new LocalStorage('./playground')
  localStorage.setItem('access_token', tokens.access_token)
  localStorage.setItem('token_type', tokens.token_type)
  localStorage.setItem('refresh_token', tokens.refresh_token)
  return tokens
}

const getUserInfoStatus = async () => {
  let localStorage = new LocalStorage('./playground')
  let userInfoURL = new URL('https://api.spotify.com/v1/me')
  let response = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  if (response.status === 401) {
    return 401
  } else {
    return 200
  }
}

const getNewToken = async () => {
  console.log('Entre a new token')
  let localStorage = new LocalStorage('./playground')
  let spotifyURL = new URL('https://accounts.spotify.com/api/token')
  let toCodeString = `${process.env.CLIEND_ID_SPOTIFY}:${process.env.CLIENT_SECRET_SPOTIFY}`
  let encodedString = btoa(toCodeString)
  let bodyData = {
    grant_type: 'refresh_token',
    refresh_token: localStorage.getItem('refresh_token')
  }
  let response = await fetch(spotifyURL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedString}`
    },
    body: new URLSearchParams(bodyData)
  })
  let data = await response.json()
  let newToken = data.access_token
  localStorage.setItem('access_token', newToken)
}

const getUserSong = async () => {
  let localStorage = new LocalStorage('./playground')
  let userInfoURL = new URL(
    'https://api.spotify.com/v1/me/player/currently-playing'
  )

  let response = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  if (response.status === 401) {
    let data = await response.text()
    console.log(data)
    return
  } else if (response.status === 200) {
    let data = await response.json()
    if (data.is_playing) {
      return data
    } else {
      return
    }
  }
}

module.exports = {
  saveTokens,
  getUserInfoStatus,
  getUserSong,
  getNewToken
}
