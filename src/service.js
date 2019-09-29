function getTwoDigitDateFormat(monthOrDate) {
  return (monthOrDate < 10) ? '0' + monthOrDate : '' + monthOrDate;
}
const d = new Date();

export const dateOfDay = `${getTwoDigitDateFormat(d.getDate())}-${getTwoDigitDateFormat(d.getMonth()+1)}-${d.getFullYear()}`;

