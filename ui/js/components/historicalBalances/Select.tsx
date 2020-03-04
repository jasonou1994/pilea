//Component should render multiple dropdown options
//Should take in props where it is an array of options objects {name: "custom", type: "custom"}
//dropdown options, onClick, should display tick mark next to text
//for type "custom" dropdown options, onClick should display tick mark and also open up a calendar view

import React, { FunctionComponent } from 'react'

interface SelectProps {
  options: Array<{ name: string; type: string }>
  onChange: (...params: any) => any
}

export const Select: FunctionComponent<SelectProps> = ({}) => {}
