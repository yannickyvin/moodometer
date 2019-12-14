import React, { Component } from 'react'
import { getTodayMoodsByTeam, getHistoryMoodsByTeam, getTeamName } from '../moodClient'
import {ReportContainer, ReportToday, ReportTrendByDay, ReportTrendByWeek, DailyInformations, LastInformations} from '../components/ChartReport'
import {MOOD, REPORT_MAX_WEEKS, LABELS, IS_ACTIVATED} from '../config/config'
import queryString from 'query-string'
import {getWeek} from 'date-fns'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Report extends Component {
  state = {
    todayMoods: [],
    todayReport: [],
    historyLastWeeksMoods: [],
    completeReport: [],
    weekReport: [],
    team: ''
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    console.log('this.props.location.search', this.props.location.search)

    const parsed = queryString.parse(this.props.location.search)
    console.log('parsed', parsed)
    let team
    if (parsed.team === undefined) {
      team = MOOD.defaultTeam
    } else {
      const teamName = await getTeamName(parsed.team);
      team = teamName === undefined ? MOOD.defaultTeam : teamName
    }

    const todayMoods = await getTodayMoodsByTeam(team)
    const historyLastWeeksMoods = await getHistoryMoodsByTeam({team, maxWeeks: REPORT_MAX_WEEKS})
    const historyAllMoods = await getHistoryMoodsByTeam({team})

    const todayReport = this.createTodayReport(todayMoods)
    const completeReport = this.createCompleteReport(historyLastWeeksMoods)
    const weekReport = this.createWeekReport(historyAllMoods)

    this.setState({ todayMoods, historyLastWeeksMoods, todayReport, completeReport, weekReport, team })
  }

  createTodayReport = (moods) => {
    let todayReport = [...MOOD.options]

    todayReport = todayReport.map((option) => ({...option, count: 0}))
    if (moods !== null && moods.length !== undefined) {
      moods.forEach((mood) => {
        const rateOptionFound = todayReport.find(elt => elt.rate === mood.rate)
        rateOptionFound.count++
      })
    }
    return todayReport
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
      <Layout>
        <div className="app d-flex flex-column space-between align-items-center h-200">
          <Header team={this.state.team} />
          <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <div className="h-20">
              <ReportToday reportDatas={this.state.todayReport} />
            </div>
            <div>
              <DailyInformations moods={this.state.todayMoods}/>
            </div>
            <div>
              <p className="font-weight-light">{LABELS.today}</p>
            </div>
            <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport}>
              <ReportTrendByDay reportDatas={this.state.completeReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
              <ReportTrendByWeek reportDatas={this.state.weekReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport}>
              <LastInformations moods={this.state.historyLastWeeksMoods} />
            </ReportContainer>
          </div>
          
          <Footer link="/" libelle="Home" search={this.props.location.search} />
        </div>
      </Layout>
      
    )
  }
}

export default Report
