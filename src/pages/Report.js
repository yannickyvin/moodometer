import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getTodayMoods, getHistory } from '../moodClient'
import MOOD from '../mood'

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
    history: null,
    todayMood: null,
    dayReport: [],
    completeReport: [],
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 60000)
  }

  refresh = async () => {
    const todayMood = await getTodayMoods()
    const history = await getHistory()
    const dayReport = this.createTodayReport(todayMood)
    const completeReport = this.createCompleteReport(history)
    this.setState({ todayMood, history, dayReport, completeReport })
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
        
        // on regarde si le jour a déjà été rencontré et enregistré dans notre rapport
        const found = report[0].datas.findIndex((data) => (data.day === mood.day))
        
        if (found === -1) {
          // nouveau jour trouvé => on ajoute le jour à toutes les options en initialisant count à 0 ou 1
          report = report.map((option) => ({...option, datas: [...option.datas, {day: mood.day, count: mood.rate === option.rate ? 1 : 0}]}))
        } else {
          // jour déjà présent => on incrémente le compteur de la journée de la bonne option
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
          <a href="https://github.com/yannickyvin/moodometer">sushimeter</a>
        </header>
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
          <Link to="/vote">Home</Link>
        </footer>
      </div>
    )
  }
}

export default App
