import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { MOOD } from '../config/config.js'


export const ReportToday = ({ dayReport }) => (
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

const Information = ({ information, color }) => (<span className="badgemood mx-1" style={{backgroundColor : color}}>{information}</span>)

const getColorFromRate = (rate) => MOOD.options.find((x) => x.rate === rate).color

export const DailyInformations = ({ todayMood }) => {
  
  return(
    <div className="d-flex flex-row flex-wrap my-3">
      {todayMood.map((x) => {
        return (x.information !== undefined && x.information !== null && x.information.length > 0 
          && <Information key={x.session} information={x.information} color={getColorFromRate(x.rate)}/>)
      })}
    </div>
  )
}

export const LastInformations = ({ historyMood }) => {
  return(
    <div className="d-flex flex-column flex-wrap my-3">
      {MOOD.options.map((option) => {
        return(
          <div className="d-flex flex-row flex-wrap my-1">
            {historyMood.map((x) => {
              return (x.information !== undefined && x.information !== null && x.information.length > 0 && x.rate === option.rate 
                && <Information key={x.session + x.day} information={x.information} color={getColorFromRate(x.rate)}/>)
            })}
          </div>
        )
      })}
    </div>
  )
}

const optionsBar = {
  maintainAspectRatio: false,
  legend: false,
  scales: {
    xAxes: [{
      display: true,
      gridLines: {
        color: 'rgb(255, 255, 255, 0.2)'
      },
      ticks: {
        fontColor: "white",
      }
    }],
    yAxes: [{
      display: true,
      gridLines: {
        color: 'rgb(255, 255, 255, 0.2)'
      },
      ticks: {
        fontColor: "white",
      }
    }]
  }
}

export const ReportTrendByDay = ({ completeReport }) => {
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

  return <Bar data={data} options={optionsBar} height={200} />
}

export const ReportTrendByWeek = ({ weekReport }) => {
  if ((!weekReport) || (weekReport.length === 0))  return null

  const data = {
    labels: weekReport.map(m => ('S' + m[0])),
    datasets: [{
      label: 'Moyenne de la semaine',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: weekReport.map(m => m[1].average)
    }],  
  }

  return <Bar data={data} options={optionsBar} height={200} />
}