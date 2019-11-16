import React from 'react'
import TextField from './text'
import TextareaField from './textarea'
import SelectField from './select'
import CheckboxField from './checkbox'

/*-----------------------------------------------------------------------------
| Field
|-----------------------------------------------------------------------------*/

export const Field = props => {
  const component = props.info.component
  if (component === 'text') return <TextField {...props} />
  if (component === 'textarea') return <TextareaField {...props} />
  if (component === 'select') return <SelectField {...props} />
  if (component === 'checkbox') return <CheckboxField {...props} />
  return <>Not Found Field</>
}

/*-----------------------------------------------------------------------------
| ErrorMessage
|-----------------------------------------------------------------------------*/

export const ErrorMessage = ({ meta }) => {
  if (hasError(meta)) return null

  return <div className="error">{meta.error}</div>
}

/*-----------------------------------------------------------------------------
| HasError
|-----------------------------------------------------------------------------*/

export const hasError = meta => {
  return meta.touched && meta.error ? true : false
}
