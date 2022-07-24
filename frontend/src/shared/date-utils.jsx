export const getReadableDate = (timestamp) => {
  const date = new Date(timestamp).toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = new Date(timestamp).toLocaleString().split(', ')[1];

  return `${date}, ${time}`;
};

export const getReadableMonthYearFromTimestamp = (timestamp) => {
  const dateParts = String(new Date(timestamp)).split(' ');
  return `${dateParts[1]} ${dateParts[3]}`;
};
