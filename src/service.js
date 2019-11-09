const getTwoDigitDateFormat = (monthOrDate) => ((monthOrDate < 10) ? '0' + monthOrDate : '' + monthOrDate)

export const dateOfDay = (format) => {
  console.log('dateOfDay', format)
  const d = new Date();
  if (format === 'YYYY-MM-DD'){
    return `${d.getFullYear()}-${getTwoDigitDateFormat(d.getMonth()+1)}-${getTwoDigitDateFormat(d.getDate())}`
  }
  else{
    return `${getTwoDigitDateFormat(d.getDate())}-${getTwoDigitDateFormat(d.getMonth()+1)}-${d.getFullYear()}`
  }
}
