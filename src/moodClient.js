import {dateOfDay} from './service.js'
const apiUrl = process.env.REACT_APP_API_URL

export const getTodayMoodsByTeam = async (team) => {
  try {
    const response = await fetch(`${apiUrl}/moods/?date=${dateOfDay('YYYY-MM-DD')}&team=${team}`)
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getAllMoods = async () => {
  try {
    const response = await fetch(`${apiUrl}/moods`)
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getHistoryMoodsByTeam = async ({team, maxWeeks}) => {
  try {
    let response
    if (maxWeeks === undefined) {
      response = await fetch(`${apiUrl}/moods/?team=${team}`)
    } else {
      response = await fetch(`${apiUrl}/moods/?team=${team}&maxweeks=${maxWeeks}`)
    }
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const postMood = async mood => {
  try {
    const response = await fetch(`${apiUrl}/moods/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(mood),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    const updatedMood = await response.json()
    return updatedMood
  } catch (e) {
    console.log(e)
    return null
  }
}
