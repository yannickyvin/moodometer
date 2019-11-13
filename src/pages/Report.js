import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getTodayMoodsByTeam, getHistoryByTeam } from '../moodClient'
import {ReportToday, ReportTrendByDay, ReportTrendByWeek, DailyInformations, LastInformations} from '../components/OpenChartReport'
import {MOOD, LABELS, IS_ACTIVATED} from '../config/config'
import queryString from 'query-string'
import {getWeek} from 'date-fns'
import Header from '../components/Header'

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
        for (let i = 0; i < dayReport.length; i++) {
          if (dayReport[i].rate === mood.rate) {dayReport[i].count += 1}
        }
      })
    }
    return dayReport
  }
  
  createCompleteReport = (moods) => {
    let report = [...MOOD.options]
    report = report.map((option) => ({...option, datas: []}))
    
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        // is day already known ?
        const found = report[0].datas.findIndex((data) => (data.day === mood.day))
        
        if (found === -1) {
          // day new => add day to each option and init count 
          report = report.map((option) => ({...option, datas: [...option.datas, {day: mood.day, count: mood.rate === option.rate ? 1 : 0}]}))
        } else {
          // day not new => increment count on specific option 
          for (let i = 0; i < report.length; i++) {
            if (report[i].rate === mood.rate ) {report[i].datas[found].count += 1}
          }
        }
      })
    }
   
    return report
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
      <div className="app d-flex flex-column space-between align-items-center h-200">
        <Header team={this.state.team} />
        <div className="app-content w-100">
          <div className="h-20">
            <ReportToday dayReport={this.state.dayReport} />
          </div>
          <div>
            <DailyInformations todayMood={this.state.todayMood}/>
          </div>
          <div>
            <p className="font-weight-light text-muted">{LABELS.today}</p>
          </div>
          {
            IS_ACTIVATED.reportByDay &&
            (<>
            <div className="h-20 w-100 my-2">
              <ReportTrendByDay completeReport={this.state.completeReport} />
            </div>
            <div className="d-flex justify-content-center">
            <p className="font-weight-light text-muted">{LABELS.trendByDayReport}</p>
            </div>
            </>)
          }
          {
            IS_ACTIVATED.reportByWeek &&
            (<>
            <div className="h-20 w-100 my-2">
                <ReportTrendByWeek weekReport={this.state.weekReport} />
            </div>
            <div className="d-flex justify-content-center">
              <p className="font-weight-light text-muted">{LABELS.trendByWeekReport}</p>
            </div>
            </>)
          }
          {
            IS_ACTIVATED.reportLastInformations &&
            (<>
            <div className="h-20 w-100 my-2">
                <LastInformations historyMood={this.state.historyMood} />
            </div>
            <div className="d-flex justify-content-center">
              <p className="font-weight-light text-muted">{LABELS.lastInformationReport}</p>
            </div>
            </>)
          }
        </div>
        <footer>
          <Link to={"/" + this.props.location.search}>Home</Link>
        </footer>
      </div>
    )
  }
}

export default Report
