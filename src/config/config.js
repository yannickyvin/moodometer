export const MOOD = {
  defaultTeam: (process.env.REACT_APP_DEFAULT_TEAM === undefined) ? 'test' : process.env.REACT_APP_DEFAULT_TEAM,
  options: [
    { id: 'happy', label: 'Super', color: '#3fdb36', img: 'happy.svg', rate: 5 },
    { id: 'smiling', label: 'Bien', color: '#b4db36', img: 'smiling.svg', rate: 4 },
    { id: 'confused', label: 'Moyen', color: '#ffc107', img: 'confused.svg', rate: 3 },
    { id: 'sad', label: 'Plutôt mal', color: '#db6536', img: 'sad.svg', rate: 2 },
    { id: 'mad', label: 'Mal', color: '#dc3545', img: 'mad.svg', rate: 1 }
  ]
}

export const REPORT_MAX_WEEKS = 3

export const LABELS = {
  question: 'Comment se passe ta journée de travail ?',
  informationUnderline: 'Avant de voter',
  informationNext: ', tu peux ajouter ici un mot en rapport avec ton humeur (évènement, tâche, difficulté...)',
  today: 'Aujourd\'hui',
  trendByDayReport: (maxWeeks) => `Votes sur les ${maxWeeks} dernières semaines`,
  trendByAverageVoteReport: (maxWeeks) => `Moyenne des votes sur les ${maxWeeks} dernières semaines`,
  trendByCountVoteReport: (maxWeeks) => `Nombre de votes sur les ${maxWeeks} dernières semaines`,
  trendByWeekReport: 'Moyenne des votes par semaine',
  lastInformationReport: (maxWeeks) => `Commentaires sur les ${maxWeeks} dernières semaines`
}

export const IS_ACTIVATED = {
  information: true,
  reportByDay: true,
  reportByWeek: true,
  reportLastInformations: true
}

export const GOOGLE_CLIENT_ID = '749885885691-mbmq26ndov6bnlmj2e9jmev83h8ieqjt.apps.googleusercontent.com'
