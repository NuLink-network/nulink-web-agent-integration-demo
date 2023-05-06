import { default as dayjs } from "dayjs";
import { locale } from "@/config";

export const formatDate = (date: number) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

export const betweenDays = (startTimestamp: number, endTimestamp: number) => `${getDate(endTimestamp).diff(getDate(startTimestamp), "day")} ${locale.messages.dateTypeDict['d'].value}`;

export const getDate = (timestamp: number) => dayjs.unix(timestamp);

export const verifyUrl = (url: string) => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(url)

export const toDisplayAddress = (address: string | null | undefined) => {
  if (!address) return '~'
  return `${address.substring(0, 4)}···${address.substring(
    address.length - 4
  )}`
}