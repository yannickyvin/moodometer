import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { MOOD } from '../config/config.js'

export const ReportContainer = ({ activate, label, children }) => {
  return(
      <>
      {activate &&
        (
          <>
            <div className="h-20 w-100 my-2">
              {children}
            </div>
            <div className="d-flex justify-content-center">
              <p className="font-weight-light">{label}</p>
            </div>
          </>
        )
      }
      </>
    )
}

export const ReportToday = ({ reportDatas }) => (
  <Doughnut
    options={{ maintainAspectRatio: false, legend: false, rotation: 1.57 }}
    data={{
      labels: reportDatas.map(o => o.label),
      datasets: [
        {
          data: reportDatas.map(o => o.count),
          backgroundColor: reportDatas.map(o => o.color),
        },
      ],
    }}
  />
)

const Information = ({ information, color }) => (<span className="badgemood m-1" style={{backgroundColor : color}}>{information}</span>)

const getColorFromRate = (rate) => MOOD.options.find((x) => x.rate === rate).color

export const DailyInformations = ({ moods }) => {
  return(
    <div className="d-flex flex-row flex-wrap my-3">
      {moods.map((x) => {
        return (x.information !== undefined && x.information !== null && x.information.length > 0 
          && <Information key={x.session} information={x.information} color={getColorFromRate(x.rate)}/>)
      })}
    </div>
  )
}

export const LastInformations = ({ moods }) => {
  return(
    <div className="d-flex flex-column flex-wrap my-3">
      {MOOD.options.map((option) => {
        return(
          <div key={option.rate} className="d-flex flex-row flex-wrap my-1">
            {moods.map((x) => {
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
        beginAtZero: true
      }
    }]
  }
}

export const ReportTrendByDay = ({ reportDatas }) => {
  if ((!reportDatas) || (reportDatas.length === 0))  return null

  const data = {
    labels: reportDatas[0].datas.map(m => m.day),
    datasets: reportDatas.map(o => ({
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

export const ReportTrendByWeek = ({ reportDatas }) => {
  const [NUMWEEK, DATA] = [0,1]
  if ((!reportDatas) || (reportDatas.length === 0))  return null

  const data = {
    labels: reportDatas.map(week => ('S' + week[NUMWEEK])),
    datasets: [{
      label: 'Moyenne de la semaine',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: reportDatas.map(week => week[DATA].average)
    }],  
  }

  return <Bar data={data} options={optionsBar} height={200} />
}