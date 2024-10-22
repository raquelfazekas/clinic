import { differenceInMonths, differenceInYears } from "date-fns"

export function formatEventDescription(durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60)
  const minutes = durationInMinutes % 60
  const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`
  const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}`

  if (hours === 0) return minutesString
  if (minutes === 0) return hoursString
  return `${hoursString} ${minutesString}`
}

export function formatTimezoneOffset(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find(part => part.type == "timeZoneName")?.value
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
})

export function formatDate(date: Date) {
  return dateFormatter.format(date)
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
})

export function formatTimeString(date: Date) {
  return timeFormatter.format(date)
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatDateTime(date: Date) {
  return dateTimeFormatter.format(date)
}


export function calculateAge(dateString: string): string {
  const birthDate = new Date(dateString)
  const currentDate = new Date()

  const years = differenceInYears(currentDate, birthDate);
  const months = differenceInMonths(currentDate, birthDate) % 12

  const yearString = years === 1 ? '1 ano' : `${years} anos`
  const monthString = months === 1 ? '1 mês' : `${months} meses`

  if (months === 0) {
    return yearString
  }

  return `${yearString} e ${monthString}`
}


export function calculateAgeWithOutMonths(dateString: string): string {
  const birthDate = new Date(dateString)
  const currentDate = new Date()

  const years = differenceInYears(currentDate, birthDate);

  return years.toString()
}



export function formatCPF(value: string) {
  const numericValue = value.replace(/\D/g, '');
  return numericValue.replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
};

export function formatPhone(value: string): string {
  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length <= 2) return numericValue;
  if (numericValue.length <= 7) return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  if (numericValue.length <= 10) return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;

  return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
};