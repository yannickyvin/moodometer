export default {
  question: 'Comment se passe ta journée de travail ?',
  toastHead: 'Merci pour ton retour !',
  toastBody: `N'oublies pas de vérifier si tu es de Maki ;-)`,
  options: [
    { id: 'happy', label: 'Super',  color: '#3fdb36', img: 'happy.svg', rate: 5 },
    { id: 'smiling', label: 'Bien', color: '#b4db36', img: 'smiling.svg', rate: 4 },
    { id: 'confused', label: 'Moyen', color: '#ffc107', img: 'confused.svg', rate: 3 },
    { id: 'sad', label: 'Plutôt mal', color: '#db6536', img: 'sad.svg', rate: 2 },
    { id: 'mad', label: 'Mal', color: '#dc3545', img: 'mad.svg', rate: 1 },
  ],
}
