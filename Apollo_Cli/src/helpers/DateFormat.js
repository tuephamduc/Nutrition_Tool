const DateFormat = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear().toString();
  const mm = (d.getMonth() + 101).toString().slice(-2);
  const dd = (d.getDate() + 100).toString().slice(-2);
  return yyyy + "-" + mm + "-" + dd;
}


export default DateFormat;