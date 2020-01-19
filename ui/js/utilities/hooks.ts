import { useEffect, useRef, useState } from 'react'

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

export const useHover = () => {
  const [value, setValue] = useState(false)

  const ref = useRef(null)

  const handleMouseOver = () => setValue(true)
  const handleMouseOut = () => setValue(false)

  useEffect(
    () => {
      const node = ref.current
      if (node) {
        node.addEventListener('mouseover', handleMouseOver)
        node.addEventListener('mouseout', handleMouseOut)

        return () => {
          node.removeEventListener('mouseover', handleMouseOver)
          node.removeEventListener('mouseout', handleMouseOut)
        }
      }
    },
    [ref.current] // Recall only if ref changes
  )

  return [ref, value]
}

export const useActiveUser = ({
  warningTime,
  signoutTime,
}: {
  warningTime: number
  signoutTime: number
}) => {
  let warnTimeout: ReturnType<typeof setTimeout>
  let logoutTimeout: ReturnType<typeof setTimeout>

  const [isWarning, setWarning] = useState(false)
  const [isLogout, setLogout] = useState(false)

  const warn = () => {
    setWarning(true)
  }
  const logout = () => {
    setLogout(true)
  }

  const setTimeouts = () => {
    warnTimeout = setTimeout(warn, warningTime)
    logoutTimeout = setTimeout(logout, signoutTime)
  }

  const clearTimeouts = () => {
    if (warnTimeout) clearTimeout(warnTimeout)
    if (logoutTimeout) clearTimeout(logoutTimeout)
  }

  useEffect(() => {
    const events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress',
    ]

    const resetTimeout = () => {
      clearTimeouts()
      setTimeouts()
    }

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout)
    }

    setTimeouts()

    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout)
        clearTimeouts()
      }
    }
  }, [])

  return { isWarning, isLogout, setWarning, setLogout }
}
