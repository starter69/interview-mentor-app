export const convertDateFormat = (origin_date: Date) => {
  const date = new Date(origin_date);
  const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  return dateString;
};
