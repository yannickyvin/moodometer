import React, { Component } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import { getTodayMoodsByTeam, getHistoryMoodsByTeam, getTeamName } from '../services/moodClientService'
import { createTodayReport, createCompleteReport, createWeekReport } from '../services/chartService'
import { MOOD, REPORT_MAX_WEEKS, LABELS, IS_ACTIVATED } from '../config/config'
import { ReportContainer, ReportToday, ReportTrendByDay, ReportTrendByWeek, DailyInformations, LastInformations } from '../components/Report/ChartReport'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'

class Report extends Component {
  abortController = new AbortController()
  state = {
    todayMoods: [],
    todayReport: [],
    historyLastWeeksMoods: [],
    completeReport: [],
    weekReport: [],
    team: ''
  }

  componentDidMount () {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    const parsed = queryString.parse(this.props.location.search)

    let team
    try {
      if (parsed.team === undefined) {
        team = MOOD.defaultTeam
      } else {
        const teamName = await getTeamName(parsed.team, this.abortController.signal)
        team = teamName === undefined ? MOOD.defaultTeam : teamName
      }
      const todayMoods = await getTodayMoodsByTeam(team, this.abortController.signal)
      const historyLastWeeksMoods = await getHistoryMoodsByTeam({ team, maxWeeks: REPORT_MAX_WEEKS }, this.abortController.signal)
      const historyAllMoods = await getHistoryMoodsByTeam({ team }, this.abortController.signal)
      
      const todayReport = (todayMoods !== null) ? createTodayReport(todayMoods) : []
      const completeReport = (historyLastWeeksMoods !== null) ? createCompleteReport(historyLastWeeksMoods) : []
      const weekReport = (historyAllMoods !== null) ? createWeekReport(historyAllMoods) : []

      this.setState({ todayMoods, historyLastWeeksMoods, todayReport, completeReport, weekReport, team })
    } catch (e) {
      console.log(e)
    }
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <Layout>
        <div className='app d-flex flex-column space-between align-items-center h-200'>
          <Header team={this.state.team} />
          <div className='d-flex flex-column justify-content-center align-items-center w-100'>
            <div className='h-20'>
              <ReportToday reportDatas={this.state.todayReport} />
            </div>
            <div>
              <DailyInformations moods={this.state.todayMoods} />
            </div>
            <div>
              <p className='font-weight-light'>{LABELS.today}</p>
            </div>
            <ReportContainer activate={IS_ACTIVATED.reportByDay} label={LABELS.trendByDayReport(3)}>
              <ReportTrendByDay reportDatas={this.state.completeReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportByWeek} label={LABELS.trendByWeekReport}>
              <ReportTrendByWeek reportDatas={this.state.weekReport} />
            </ReportContainer>

            <ReportContainer activate={IS_ACTIVATED.reportLastInformations} label={LABELS.lastInformationReport(3)}>
              <LastInformations moods={this.state.historyLastWeeksMoods} />
            </ReportContainer>
          </div>

          <Footer link='/' libelle='Home' search={this.props.location.search} />
        </div>
      </Layout>

    )
  }
}

Report.propTypes = {
  location: PropTypes.object
}

export default Report
