import React, { Component } from 'react'
import { getTodayMoodsByTeam, getHistoryByTeam } from '../moodClient'
import {ReportContainer, ReportToday, ReportTrendByDay, ReportTrendByWeek, DailyInformations, LastInformations} from '../components/ChartReport'
import {MOOD, LABELS, IS_ACTIVATED} from '../config/config'
import queryString from 'query-string'
import {getWeek} from 'date-fns'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Report extends Component {
  state = {
    todayMood: [],
    historyMood: [],
    dayReport: [],
    completeReport: [],
    weekReport: [],
    team: MOOD.defaultTeam
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    const props = queryString.parse(this.props.location.search)
    const team = props.team === undefined ? MOOD.defaultTeam : props.team 

    const todayMood = await getTodayMoodsByTeam(team)
    const historyMood = await getHistoryByTeam(team)
    const dayReport = this.createTodayReport(todayMood)
    const completeReport = this.createCompleteReport(historyMood)
    const weekReport = this.createWeekReport(historyMood)

    this.setState({ todayMood, historyMood, dayReport, completeReport, weekReport, team })
  }

  createTodayReport = (moods) => {
    let dayReport = [...MOOD.options]

    dayReport = dayReport.map((option) => ({...option, count: 0}))
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        const rateOptionFound = dayReport.find(elt => elt.rate === mood.rate)
        rateOptionFound.count++
      })
    }
    return dayReport
  }
  
  createCompleteReport = (moods) => {
    let completeReport = [...MOOD.options]
    completeReport = completeReport.map((option) => ({...option, datas: []}))
    
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        // is day already known ?
        const found = completeReport[0].datas.findIndex((data) => (data.day === mood.day))
        
        if (found === -1) {
          // day new => add day to each option and init count 
          completeReport = completeReport.map((option) => ({...option, datas: [...option.datas, {day: mood.day, count: mood.rate === option.rate ? 1 : 0}]}))
        } else {
          // day not new => increment count on specific option
          const rateOptionFound = completeReport.find(elt => elt.rate === mood.rate)
          rateOptionFound.datas[found].count += 1
        }
      })
    }
    return completeReport
  }

  createWeekReport = (moods) => {
    let weekRate = new Map();

    moods.forEach((mood) => {
      
      const date = new Date(mood.day)
      const week = getWeek(date)
      if (weekRate.size === 0 || !weekRate.has(week)) {
        weekRate.set(week, {count: 1, average: mood.rate})
      } else {
        let {count, average} = weekRate.get(week)
        average = ((average*count + mood.rate) / (count + 1)).toFixed(1)
        count++
        weekRate.set(week, {count, average})
      }
    })

    const arrayWeekRate = Array.from(weekRate)
    arrayWeekRate.sort((a, b) => (a[0] - b[0]))
    
    return arrayWeekRate
  }

  render() {
    return (
      <div className="cont w-100 d-flex justify-content-center">
      
        <div className="app d-flex flex-column space-between align-items-center h-200">
          <Header team={this.state.team} />
          <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <div className="h-20">
              <ReportToday dayReport={this.state.dayReport} />
            </div>
            <div>
              <DailyInformations todayMood={this.state.todayMood}/>
            </div>
            <div>
              <p className="font-weight-light">{LABELS.today}</p>
            </div>
            <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport}>
              <ReportTrendByDay completeReport={this.state.completeReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
              <ReportTrendByWeek weekReport={this.state.weekReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport}>
              <LastInformations historyMood={this.state.historyMood} />
            </ReportContainer>
          </div>
          
          <Footer link="/" libelle="Home" search={this.props.location.search} />
        </div>
      
      </div>
    )
  }
}

export default Report
