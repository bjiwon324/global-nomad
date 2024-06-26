export function postformatDate(dateString: Date | string) {
  if (dateString === undefined) return;

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function changeDateToStringFormat(dateString: Date | string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}년 ${month < 10 ? '0' + month : month}월 ${day < 10 ? '0' + day : day}일`;

  return formattedDate;
}

export function displayDateFormat(dateString: Date | string) {
  if (dateString === undefined) return;

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}
