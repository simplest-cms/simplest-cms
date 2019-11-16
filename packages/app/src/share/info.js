import { extractArguments, stringToBoolean, removeQuote } from './helpers'
import { isBoolean } from 'lodash'

const ComponentNames = ['text', 'textarea', 'select', 'checkbox']

class Info {
  constructor(row) {
    this.parseArr = this._parse(row, false)
    this.parse = this._parse(row)
    this.errors = []
  }

  getData() {
    const parse = this.parse
    const data = { required: false }

    // Component
    data.component = this._getComponentName()
    data.arguments = this._getComponentArgs()

    // Select
    if (data.component === 'select') {
      if (data.arguments === null) this._addError('select', 'Requires arguments')
    }

    // Checkbox
    if (data.component === 'checkbox') {
      parse['not-required'] = true
      parse.default = stringToBoolean(parse.default)
    }

    // Label
    if (parse.label) data.label = this._normalizeString(parse.label)

    // Description
    if (parse.description) data.description = this._normalizeString(parse.description)

    // Required
    if (parse.hasOwnProperty('required')) data.required = true
    if (parse.hasOwnProperty('not-required')) data.required = false

    // Default
    if (parse.hasOwnProperty('default')) data.default = this._normalizeString(parse.default)

    return data
  }

  /**
   * Get information of the field
   *
   * Here's an example:
   * <code>
   * const infoField = Info._parse(`text default('English') required`, false)
   * // output:
   * // [
   * //   { type: 'text', args: null },
   * //   { type: 'default', args:[ "'English'" ] },
   * //   { type: 'required', args: null }
   * // ]
   * </code>
   *
   * @param {string} row    all Information of the field.
   * @return {array|object}
   */
  _parse(row, inObject = true) {
    const extractWordsRegex = /[\w-]+(\(.*?\))?/gm
    const words = []
    let match, str, name, args

    while ((match = extractWordsRegex.exec(row)) !== null) {
      if (match.index === extractWordsRegex.lastIndex) extractWordsRegex.lastIndex++
      str = match[0]
      name = match[1] ? str.replace(match[1], '') : str
      args = extractArguments(str)
      words.push({ name, args })
    }

    return inObject
      ? words.reduce((acc, cur) => {
          acc[cur.name] = cur.args
          return acc
        }, {})
      : words
  }

  _getComponentName() {
    const comp = this.parseArr.find(item => ComponentNames.indexOf(item.name) >= 0)
    return comp ? comp.name : null
  }

  _getComponentArgs() {
    const comp = this._getComponentName()
    if (comp === null) return null
    let args = this.parse[comp]
    if (args === null) return null
    return args.map(item => removeQuote(item))
  }

  _addError(title, message) {
    this.errors.push({ title, message })
  }

  _normalizeString(str) {
    let temp = str
    if (isBoolean(temp)) return temp
    if (Array.isArray(str)) temp = str[0]
    return removeQuote(temp.trim())
  }
}

export default Info
