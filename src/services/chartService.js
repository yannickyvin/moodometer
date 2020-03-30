import { getWeek, getYear } from 'date-fns'
import { MOOD } from '../config/config'

export const createTodayReport = (moods) => {
  let todayReport = [...MOOD.options]

  todayReport = todayReport.map((option) => ({ ...option, count: 0 }))
  if (moods !== null && moods.length !== undefined) {
    moods.forEach((mood) => {
      const rateOptionFound = todayReport.find(elt => elt.rate === mood.rate)
      rateOptionFound.count++
    })
  }
  return todayReport
}

export const createCompleteReport = (moods) => {
  let completeReport = [...MOOD.options]
  completeReport = completeReport.map((option) => ({ ...option, datas: [] }))

  if (moods !== null && moods.length !== undefined) {
    moods.forEach((mood) => {
      // is day already known ?
      const found = completeReport[0].datas.findIndex((data) => (data.day === mood.day))

      if (found === -1) {
        // day new => add day to each option and init count
        completeReport = completeReport.map((option) => ({ ...option, datas: [...option.datas, { day: mood.day, count: mood.rate === option.rate ? 1 : 0 }] }))
      } else {
        // day not new => increment count on specific option
        const rateOptionFound = completeReport.find(elt => elt.rate === mood.rate)
        rateOptionFound.datas[found].count += 1
      }
    })
  }
  return completeReport
}

export const createWeekReport = (moods) => {
  const weekRate = []

  moods.forEach((mood) => {
    const date = new Date(mood.day)
    let week = getWeek(date)
    let year = getYear(date)

    if ((date >= new Date('2019-12-30')) && (date <= new Date('2020-01-01'))) {
      week = 1
      year = 2020
    }

    const found = weekRate.find(element => (element.week === week) && (element.year === year))

    if (found) {
      found.average = ((found.average * found.count + mood.rate) / (found.count + 1)).toFixed(1)
      found.count++
    } else {
      weekRate.push({
        week,
        year,
        count: 1,
        average: mood.rate
      })
    }
  })

  weekRate.sort((a, b) => ((a.year * 100 + a.week) - (b.year * 100 + b.week)))

  return weekRate
}
