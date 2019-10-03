import {dateOfDay} from './service.js'
const apiUrl = process.env.REACT_APP_API_URL

export const getTodayMoods = async () => {
  try {
    const response = await fetch(`${apiUrl}/moods/?date=${dateOfDay()}`)
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const postMood = async mood => {
  try {
    console.log('Posting mood', JSON.stringify(mood))
    const response = await fetch(`${apiUrl}/moods/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(mood),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    const updatedMood = await response.json()
    console.log('Updated mood', updatedMood)
    return updatedMood
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getHistory = async () => {
  try {
    const response = await fetch(`${apiUrl}/moods`)
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}
