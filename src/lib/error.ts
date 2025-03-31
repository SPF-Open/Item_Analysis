import { Log, type Payload } from "@lv00/toolkit"
import { writable } from "svelte/store"

const { Console, Logger, Level, Transporter } = Log

type Error = {
  message: string
  level: Level
}

export const errors = writable<Error[]>([])

class SvelteTransporter extends Transporter {
  send(log: Payload): void {
    errors.update(errors => [...errors, {
      message: log.message,
      level: log.level
    }])
  }
}

const consoleTransporter = new Console()
const svelteTransporter = new SvelteTransporter()

export const logger = new Logger({
  t: [consoleTransporter, svelteTransporter],
})