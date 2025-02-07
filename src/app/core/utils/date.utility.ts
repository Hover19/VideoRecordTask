export function getDate(dateString: string): string {
  const date = new Date(dateString);
  const fullDay = date.getDate();
  const fullMonth = date.getMonth() + 1;
  const fullYear = date.getFullYear();

  return `${fullDay < 10 ? '0' + fullDay : fullDay}.${
    fullMonth < 10 ? '0' + fullMonth : fullMonth
  }.${fullYear}`;
}

export function getTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
