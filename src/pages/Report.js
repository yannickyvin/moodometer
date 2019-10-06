import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getTodayMoodsByTeam, getHistoryByTeam } from '../moodClient'
import MOOD from '../mood'
import queryString from 'query-string'

const Today = ({ dayReport }) => (
  <Doughnut
    options={{ maintainAspectRatio: false, legend: false, rotation: 1.57 }}
    data={{
      labels: dayReport.map(o => o.label),
      datasets: [
        {
          data: dayReport.map(o => o.count),
          backgroundColor: dayReport.map(o => o.color),
        },
      ],
    }}
  />
)

const Trend = ({ completeReport }) => {
  if ((!completeReport) || (completeReport.length === 0))  return null

  const data = {
    labels: completeReport[0].datas.map(m => m.day),
    datasets: completeReport.map(o => ({
      label: o.label,
      type: 'line',
      data: o.datas.map(c => (c.count)),
      fill: false,
      borderColor: o.color,
      backgroundColor: o.color,
    })),
  }

  const options = {
    maintainAspectRatio: false,
    legend: false,
    scales: {
      yAxes: [
        {
          // stacked: true,
        },
      ],
    },
  }

  return <Bar data={data} options={options} height={200} />
}

class App extends Component {
  state = {
    dayReport: [],
    completeReport: [],
    team: MOOD.defaultTeam
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    const props = queryString.parse(this.props.location.search);
    const team = props.team === undefined ? MOOD.defaultTeam : props.team 

    const todayMood = await getTodayMoodsByTeam(team)
    const history = await getHistoryByTeam(team)
    const dayReport = this.createTodayReport(todayMood)
    const completeReport = this.createCompleteReport(history)
    this.setState({ dayReport, completeReport, team })
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

  render() {
    return (
      <div className="app">
        <header>
          <a href="https://github.com/yannickyvin/moodometer">moodometer</a>
        </header>
        <p className="font-weight-light text-muted italic">Equipe : {this.state.team}</p>
        <div className="app-content">
          <div>
            <Today dayReport={this.state.dayReport} />
          </div>
          <p className="font-weight-light text-muted">Aujourd'hui</p>
          <div className="h-50">
            <Trend completeReport={this.state.completeReport} />
          </div>
        </div>
        <footer>
          <Link to={"/" + this.props.location.search}>Home</Link>
        </footer>
      </div>
    )
  }
}

export default App
