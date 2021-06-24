
export type timezoneOffset = `${'UTC' | ''}${'-' | '+'}${number}`

export type transPostDataTo = 'raw' | 'form' | 'params'

export type fullUrl = `${'http' | 'https'}://${string}/`

// btoa('http') -> "aHR0cA=="
// btoa('https') -> "aHR0cHM="
// btoa('http://') -> "aHR0cDovLw=="
// btoa('https://') -> "aHR0cHM6Ly8="
export type fullUrlProtect = `aHR0c${string}`
