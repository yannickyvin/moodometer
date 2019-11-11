export const MOOD = {
  defaultTeam: 'sushi',
  options: [
    { id: 'happy', label: 'Super',  color: '#3fdb36', img: 'happy.svg', rate: 5 },
    { id: 'smiling', label: 'Bien', color: '#b4db36', img: 'smiling.svg', rate: 4 },
    { id: 'confused', label: 'Moyen', color: '#ffc107', img: 'confused.svg', rate: 3 },
    { id: 'sad', label: 'Plutôt mal', color: '#db6536', img: 'sad.svg', rate: 2 },
    { id: 'mad', label: 'Mal', color: '#dc3545', img: 'mad.svg', rate: 1 },
  ],
}

export const LABELS = {
  question: 'Comment se passe ta journée de travail ?',
  informationUnderline: 'Avant de voter',
  informationNext: ', tu peux ajouter ici un mot en rapport avec ton humeur (évènement, tâche, difficulté...)',
  today: 'Aujourd\'hui'
}

export const IS_ACTIVATED = {
  reportByDay: true,
  reportByWeek: true,
  information: true
}
