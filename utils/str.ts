// capitalize each word in a string
export function capitalize(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export function formatTwoDecimal(num: number): number {
  return Math.round(num * 100) / 100
}
