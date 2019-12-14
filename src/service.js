const getTwoDigitDateFormat = (monthOrDate) => ((monthOrDate < 10) ? '0' + monthOrDate : '' + monthOrDate)

export const dateOfDay = (format) => {
  const d = new Date()
  if (format === 'YYYY-MM-DD'){
    return `${d.getFullYear()}-${getTwoDigitDateFormat(d.getMonth()+1)}-${getTwoDigitDateFormat(d.getDate())}`
  }
  else{
    return `${getTwoDigitDateFormat(d.getDate())}-${getTwoDigitDateFormat(d.getMonth()+1)}-${d.getFullYear()}`
  }
}

export const dayOfYear = () => {

  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)

  return day
}
