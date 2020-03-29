/* eslint-disable no-undef */
import { dateOfDay } from './dateService'
const apiUrl = process.env.REACT_APP_API_URL

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

export const getTodayMoodsByTeams = async teams => {
  try {
    const response = await fetch(`${apiUrl}/moods/teams/list`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ teams, date: dateOfDay('YYYY-MM-DD')}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getHistoryMoodsByTeams = async ({ teams, maxWeeks }) => {
  try {
    let body
    if (maxWeeks === undefined) {
      body = JSON.stringify({ teams })
    } else {
      body = JSON.stringify({ teams, maxweeks: maxWeeks })
    }
    const response = await fetch(`${apiUrl}/moods/teams/list`, {
      method: 'POST',
      mode: 'cors',
      body,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getHistoryMoodsByTeam = async ({ team, maxWeeks }) => {
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

export const getAllTeams = async () => {
  try {
    const response = await fetch(`${apiUrl}/teams`)
    const content = await response.json()
    return content
  } catch (e) {
    console.log(e)
    return null
  }
}

export const postTeam = async team => {
  try {
    const response = await fetch(`${apiUrl}/teams/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(team),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    const updatedTeam = await response.json()
    return updatedTeam
  } catch (e) {
    console.log(e)
    return null
  }
}

export const deleteTeam = async team => {
  try {
    const response = await fetch(`${apiUrl}/teams/?publicid=${team.publicid}`, {
      method: 'DELETE',
      mode: 'cors'
    })
    const updatedTeam = await response.json()
    return updatedTeam
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getTeamName = async teamId => {
  try {
    const response = await fetch(`${apiUrl}/teams?publicid=${teamId}`)
    const content = await response.json()
    const result = content.length === 0 ? undefined : content[0].nom
    return result
  } catch (e) {
    console.log(e)
    return null
  }
}
