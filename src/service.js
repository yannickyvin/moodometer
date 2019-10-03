const getTwoDigitDateFormat = (monthOrDate) => ((monthOrDate < 10) ? '0' + monthOrDate : '' + monthOrDate)

export const dateOfDay = () => {
  const d = new Date();
  return `${getTwoDigitDateFormat(d.getDate())}-${getTwoDigitDateFormat(d.getMonth()+1)}-${d.getFullYear()}`
}
