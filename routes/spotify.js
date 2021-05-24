const {URL, URLSearchParams} = require('url')
const express = require('express')
let LocalStorage = require('node-localstorage').LocalStorage
const router = express.Router('router')
const {
  saveTokens,
  getUserInfoStatus,
  getUserSong,
  getNewToken
} = require('../controllers/spotify')
router.get('/', async (req, res) => {
  localStorage = new LocalStorage('./playground')
  if (!localStorage.getItem('access_token')) {
    let spotifyUrl = new URL('https://accounts.spotify.com/authorize')
    let params = {
      client_id: process.env.CLIEND_ID_SPOTIFY,
      response_type: 'code',
      redirect_uri: 'http://localhost:7000/spotify/home',
      scope: 'user-read-playback-state'
    }
    spotifyUrl.search = new URLSearchParams(params).toString()

    res.redirect(spotifyUrl)
  } else {
    res.status(200).send('You already have access')
  }
})

router.get('/home', async (req, res) => {
  let currentURL = new URL(
    req.protocol + '://' + req.get('host') + req.originalUrl
  )
  let params = currentURL.searchParams
  let authorizationCode = params.get('code')
  let tokens = await saveTokens(authorizationCode)
  if (tokens) {
    res.status(200).send(' We got you')
  } else {
    res.status(400).send('There is a problem with the credentials')
  }
})

const checkToken = async (req, res, next) => {
  let infoToken = await getUserInfoStatus()
  if (infoToken === 401) {
    await getNewToken()
  }
  next()
}

router.get('/current_song', checkToken, async (req, res) => {
  let data = await getUserSong()
  if (data) {
    res.status(200).send(data)
  } else {
    console.log('Entre')
    res.status(404).send('Not playing song')
  }
})

module.exports = router
