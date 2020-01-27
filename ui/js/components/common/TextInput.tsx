import classNames from 'classnames'
import React, { FunctionComponent } from 'react'

interface TextInputProps {
  id?: string
  invalid: boolean
  label?: string
  onChange: (input: string) => any
  placeholder: string
  type: 'text' | 'password'
  value: string
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  id,
  label,
  invalid,
  type,
  value,
  onChange,
  placeholder,
}) => (
  <div className="input-group" style={{ width: '100%' }}>
    {label && <span>{label}</span>}
    <input
      id={id}
      className={classNames({ invalid })}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    ></input>
  </div>
)
