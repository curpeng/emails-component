import EmailNode from './EmailNode'

export default class EmailsInput {
  constructor (containerNode, options) {
    this.containerNode = containerNode
    this.options = Object.assign(
      {
        placeholder: 'Add more people',
        containerClassName: 'emails-input',
        currentNodeClassName: 'emails-input__current-node'
      }, options)

    this.__listeners = Object.freeze({
      keydown: this.__keyDownHandler.bind(this),
      blur: this.__blurHandler.bind(this),
      paste: this.__pasteHandler.bind(this)
    })

    this.values = []
    this.currentNode = this.__buildNode()

    this.containerNode.addEventListener('click', () => {
      this.currentNode.focus()
    })
    this.containerNode.classList.add(this.options.containerClassName)
    this.containerNode.appendChild(this.currentNode)
  }

  addValue (value) {
    if (value.trim().length === 0) { return }

    const emailNode = new EmailNode(value)

    this.values.push(emailNode)
    this.containerNode.insertBefore(emailNode.htmlNode, this.containerNode.lastChild)
    this.currentNode.value = ''
  }

  emails ({ onlyValid = false }) {
    const nodes = onlyValid ? this.values.filter((emailNode) => emailNode.isValid) : this.values
    return nodes.map((emailNode) => (emailNode.value))
  }

  setEmails (emails) {
    this.values.forEach(node => { node.htmlNode.remove() })
    this.values = []
    emails.forEach((email) => this.addValue(email))
  }

  __buildNode () {
    const input = document.createElement('input')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('placeholder', this.options.placeholder)
    input.classList.add(this.options.currentNodeClassName)
    input.classList.add(this.options.currentNodeClassName)

    for (const eventName in this.__listeners) {
      const handler = this.__listeners[eventName]
      input.addEventListener(eventName, handler)
    }

    return input
  }

  __keyDownHandler (event) {
    if (event.keyCode === 188 || event.keyCode === 13) {
      event.preventDefault()
      this.addValue(this.currentNode.value)
    } else {
      // a user has already cleared the whole input and clicks backspace key
      if (event.keyCode === 8 && this.currentNode.value.length === 0) {
        this.__removeLastValue()
      }
    }
  }

  __blurHandler (_event) {
    if (this.currentNode.value.trim().length !== 0) { this.addValue(this.currentNode.value) }
  }

  __pasteHandler (event) {
    event.preventDefault()

    const paste = (event.clipboardData || window.clipboardData).getData('text')
    const pastedValues = paste.split(',')

    pastedValues.forEach(value => { this.addValue(value) })
  }

  __removeLastValue () {
    if (this.values.length === 0) { return }

    const indexOfLastChild = this.values.length - 1
    this.values.length -= 1

    this.__removeNode(indexOfLastChild)
  }

  __removeNode (index) {
    const nodeToRemove = this.containerNode.children[index]
    if (nodeToRemove) { nodeToRemove.remove() }
  }
}
