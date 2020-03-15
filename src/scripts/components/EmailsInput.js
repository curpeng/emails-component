import EmailNode from './EmailNode'

export default class EmailsInput {
  constructor (containerNode, options) {
    this.containerNode = containerNode
    this.options = Object.assign(
      {
        placeholder: 'Add more people',
        containerClassName: 'emails-input',
        currentNodeClassName: 'emails-input__current-node',
        onChange: (newValues) => { }
      }, options)

    this.__listeners = Object.freeze({
      keydown: this.__keyDownHandler.bind(this),
      blur: this.__blurHandler.bind(this),
      paste: this.__pasteHandler.bind(this)
    })

    this.values = {}
    this.lastEmailNode = null
    this.currentNode = this.__buildNode()

    this.containerNode.addEventListener('click', () => { this.currentNode.focus() })
    this.containerNode.classList.add(this.options.containerClassName)
    this.containerNode.appendChild(this.currentNode)
  }

  addEmail (value) {
    if (value.trim().length === 0) { return }

    const emailNode = new EmailNode(value, this.lastEmailNode, null, { onRemove: this.__removeEmailNode.bind(this) })

    if (this.lastEmailNode) {
      this.lastEmailNode.next = emailNode
    }

    this.values[value] = emailNode
    this.containerNode.insertBefore(emailNode.htmlNode, this.containerNode.lastChild)

    this.lastEmailNode = emailNode
    this.currentNode.value = ''

    this.__onChange()
  }

  emails ({ onlyValid = false }) {
    const result = []
    let node = this.lastEmailNode

    while (node !== null) {
      if (node && (!onlyValid || node.isValid)) {
        result.unshift(node.value)
      }
      node = node.prev
    }

    return result
  }

  setEmails (emails) {
    let node = this.lastEmailNode

    while (node !== null) {
      this.__removeEmailNode(node, true)
      node = node.prev
    }

    emails.forEach(this.addEmail.bind(this))
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
      this.addEmail(this.currentNode.value)
    } else {
      // a user has already cleared the whole input and clicks backspace key
      if (event.keyCode === 8 && this.currentNode.value.length === 0) {
        event.preventDefault()
        if (this.lastEmailNode) { this.__removeEmailNode(this.lastEmailNode) }
      }
    }
  }

  __blurHandler (_event) {
    if (this.currentNode.value.trim().length !== 0) { this.addEmail(this.currentNode.value) }
  }

  __pasteHandler (event) {
    event.preventDefault()

    const paste = (event.clipboardData || window.clipboardData).getData('text')
    const pastedValues = paste.split(',')

    pastedValues.forEach(value => { this.addEmail(value) })
  }

  __onChange () {
    this.options.onChange(this.emails({}))
  }

  __removeEmailNode (emailNode, silently = false) {
    const nextNode = emailNode.next

    if (nextNode) {
      nextNode.prev = emailNode.prev
    }

    const prevNode = emailNode.prev
    if (prevNode) {
      prevNode.next = nextNode
    }

    if (emailNode === this.lastEmailNode) {
      this.lastEmailNode = prevNode
    }

    emailNode.htmlNode.remove()
    delete this.values[emailNode.value]

    if (!silently) {
      this.__onChange()
    }
  }
}
