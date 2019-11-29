import moment from 'moment'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
  ONE_YEAR,
  YEAR,
  AvailableTimeStrings,
  TWO_YEARS,
  SIX_MONTHS,
  MONTH,
  THREE_MONTHS,
  WEEK,
} from '../konstants'
import { PileaCard } from '../sagas/sagas'
import {
  TimeConsolidatedTransactionGroup,
  TimeConsolidatedTransactionGroups,
} from '../reducers'
import { useEffect, useRef } from 'react'
import {
  NotificationWithDuration,
  TEMPORARY,
  PERSISTENT,
} from '../components/NotificationsContainer'
import uuid from 'uuid'

export const formatMilliseconds: (milli: number) => string = milli =>
  moment(milli).format('MMM Do, YYYY')

export const formatNumberAsDollars: (number: number) => string = number =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number)

export const parseSSEFields = (rawString: string) => {
  return (
    rawString
      // since the string is multi line, each for a different field, split by line
      .split('\n')
      // remove empty lines
      .filter(field => field !== '')
      // massage fields so they can be parsed into JSON
      .map(field => {
        const fieldColonSplit = field
          .replace(/:/, '&&&&&&&&')
          .split('&&&&&&&&')
          .map((kv: string): string => kv.trim())

        const fieldObj = {
          [fieldColonSplit[0]]: fieldColonSplit[1],
        }
        return fieldObj
      })
      .reduce((acc, cur) => {
        // handles if there are multiple fields of the same type, for example two data fields.
        const key = Object.keys(cur)[0]
        if (acc[key]) {
          acc[key] = `${acc[key]}\n${cur[key]}`
        } else {
          acc[key] = cur[key]
        }
        return acc
      }, {})
  )
}

// transfer credit negative
const nonCountedCategories = [
  { accountType: 'credit', amount: 'negative', category: 'Payment' },
  { accountType: 'depository', amount: 'positive', category: 'Payment' },
  { accountType: 'credit', amount: 'negative', category: 'Transfer' },
  // { accountType: 'depository', amount: 'negative', category: 'Transfer' },
  { accountType: 'depository', amount: 'positive', category: 'CreditCard' },
  { accountType: 'depository', amount: 'positive', category: 'Deposit' },
].reduce((acc, { accountType, amount, category }) => {
  acc[`${accountType}-${amount}-${category}`] = true
  return acc
}, {} as { [category: string]: true })

export const shouldKeepTransaction: (
  tx: {
    amount: number
    category: string | string[]
  },
  accountType: string
) => boolean = ({ amount, category }, accountType) => {
  if (!category) {
    return true
  }

  const cleanedCategories =
    category instanceof Array
      ? category
      : category
          .replace(/[{|}|"]/g, '')
          .split(',')
          .map(cat => cat.trim())

  return cleanedCategories.reduce((acc, category) => {
    const tryMatch = `${accountType}-${
      amount >= 0 ? 'positive' : 'negative'
    }-${category}`

    if (nonCountedCategories[tryMatch]) {
      acc = false
    }

    return acc
  }, true as boolean)
}

export const convertDateSelectString: (
  string: AvailableTimeStrings
) => {
  [HISTORICAL_TIME_COUNT]: number
  [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
} = string => {
  switch (string) {
    case ONE_YEAR: {
      return {
        [HISTORICAL_TIME_COUNT]: 1,
        [HISTORICAL_TIME_UNIT]: YEAR,
      }
    }
    case TWO_YEARS: {
      return {
        [HISTORICAL_TIME_COUNT]: 2,
        [HISTORICAL_TIME_UNIT]: YEAR,
      }
    }
    case SIX_MONTHS: {
      return {
        [HISTORICAL_TIME_COUNT]: 6,
        [HISTORICAL_TIME_UNIT]: MONTH,
      }
    }
    case THREE_MONTHS: {
      return {
        [HISTORICAL_TIME_COUNT]: 3,
        [HISTORICAL_TIME_UNIT]: MONTH,
      }
    }
  }
}

export const convertDateSelectObject: ({
  historicalTimeCount,
  historicalTimeUnit,
}: {
  historicalTimeCount: number
  historicalTimeUnit: AvailableTimeUnits
}) => AvailableTimeStrings = ({ historicalTimeCount, historicalTimeUnit }) => {
  return historicalTimeCount === 2 && historicalTimeUnit === 'year'
    ? TWO_YEARS
    : historicalTimeCount === 1 && historicalTimeUnit === 'year'
    ? ONE_YEAR
    : historicalTimeCount === 6 && historicalTimeUnit === 'month'
    ? SIX_MONTHS
    : THREE_MONTHS
}

export const getTypeOfCard: ({
  cards,
  id,
}: {
  cards: PileaCard[]
  id: string
}) => string | null = ({ cards, id }) => {
  const card = cards.find(card => card.account_id === id)

  return card ? card.type : null
}

export const getCardName: ({
  cards,
  id,
}: {
  cards: PileaCard[]
  id: string
}) => string | null = ({ cards, id }) => {
  const card = cards.find(account => account.account_id === id)

  return card ? (card.official_name ? card.official_name : card.name) : null
}

export const getOrderedDates: (
  fidelity: AvailableTimeUnits,
  historicalTimeCount: number,
  historicalTimeUnit: AvailableTimeUnits
) => {
  orderedDatesArray: string[]
  orderedDatesMap: {
    [key: string]: TimeConsolidatedTransactionGroup
  }
} = (fidelity, historicalTimeCount, historicalTimeUnit) => {
  const totalDaysInHistoricalLength =
    historicalTimeCount *
    (historicalTimeUnit === YEAR
      ? 365
      : historicalTimeUnit === MONTH
      ? 31
      : historicalTimeUnit === WEEK
      ? 7
      : 1)

  const countDataPoints = Math.floor(
    totalDaysInHistoricalLength /
      (fidelity === YEAR
        ? 365
        : fidelity === MONTH
        ? 30
        : fidelity === WEEK
        ? 7
        : 1)
  )

  // ordered dates from current to past
  const orderedDatesArray = Array(countDataPoints)
    .fill(null)
    .map((_, i) =>
      moment()
        .subtract(i + 1, fidelity)
        .format('YYYY-MM-DD')
    )

  const orderedDatesMap = orderedDatesArray.reduce((result, date) => {
    result[date] = {
      input: 0,
      output: 0,
      transactions: [],
    } as TimeConsolidatedTransactionGroup

    return result
  }, {} as TimeConsolidatedTransactionGroups)

  return { orderedDatesArray, orderedDatesMap }
}

export const useInterval = (callback: any, delay: any) => {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export const createNotification: (
  title: string,
  message: string,
  success: boolean,
  duration?: number,
  temporary?: boolean
) => NotificationWithDuration = (
  title,
  message,
  success,
  duration = 5,
  temporary = true
) => {
  return {
    timeCreated: Date.now(),
    durationType: temporary ? TEMPORARY : PERSISTENT,
    durationInSeconds: duration,
    id: uuid(),
    success,
    title,
    message,
  }
}
