import EmailNode from './EmailNode'

export default class EmailsInput {
  constructor (containerNode, options) {
    this.containerNode = containerNode
    this.options = Object.assign(
      {
        currentNodeClassName: 'current-node'
      }, options)

    this.__listeners = Object.freeze({
      keydown: this.__keyDownHandler.bind(this),
      blur: this.__blurHandler.bind(this)
    })

    this.values = []
    this.currentNode = this.__buildNode()

    this.containerNode.addEventListener('click', () => {
      this.currentNode.focus()
    })

    this.containerNode.appendChild(this.currentNode)
  }

  addValue (value) {
    if (value.trim().length === 0) { return }

    const email = new EmailNode(value)

    this.values.push(value)
    this.containerNode.insertBefore(email.htmlNode, this.containerNode.lastChild)
    this.currentNode.value = ''
  }

  __buildNode () {
    const input = document.createElement('input')
    input.setAttribute('autocomplete', 'off')
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
