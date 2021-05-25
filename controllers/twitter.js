const fetch = require('node-fetch')
const {URL, URLSearchParams} = require('url')
const LocalStorage = require('node-localstorage').LocalStorage
const crypto = require('crypto')
const Twitter = require('twitter')
const changeBio = async (newBio) => {
  let client = new Twitter({
    consumer_key: process.env.API_KEY_TWITTER,
    consumer_secret: process.env.API_SECRET_KEY_TWITTER,
    access_token_key: process.env.ACCESS_TOKEN_TWITTER,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_TWITTER
  })

  let client_response = client.post('account/update_profile', {
    description: newBio
  })
}

const checkSong = async () => {
  let response = await fetch(
    `http://${process.env.CURRENT_URL}/spotify/current_song`
  )
  let data = await response.json()
  if (response.status === 200) {
    return data
  } else {
    return false
  }
}

const initProgram = async () => {
  let isSong = await checkSong()
  let timeout = false
  if (isSong) {
    let current_bio = await getBioInfo()
    let bio_parsed = current_bio.split('|')
    timeout = isSong.item.duration_ms - isSong.progress_ms
    bio_parsed[
      bio_parsed.length - 1
    ] = `▶ ${isSong.item.name}- ${isSong.item.artists[0].name}`

    let bio_new = constructBioString(bio_parsed)
    changeBio(bio_new)
  } else {
    let old_bio = `Ingeniero de Sistemas | Noctámbulo a tiempo completo |  A veces hago proyectos personales| Opiniones personales |⏸ Nada por ahora`
    changeBio(old_bio)
  }
  console.log(timeout)
  setTimeout(initProgram, timeout || 60000)
}

const constructBioString = (bio_parsed) => {
  let output_string = bio_parsed.toString()
  output_string = output_string.replace(/,/g, '|')
  return output_string
}

const getBioInfo = async () => {
  let client = new Twitter({
    consumer_key: process.env.API_KEY_TWITTER,
    consumer_secret: process.env.API_SECRET_KEY_TWITTER,
    access_token_key: process.env.ACCESS_TOKEN_TWITTER,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET_TWITTER
  })
  let info_client = client.get('account/verify_credentials', {})

  let response = await info_client

  return response.description
}

module.exports = {
  initProgram
}
