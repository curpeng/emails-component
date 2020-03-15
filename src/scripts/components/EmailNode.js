export default class EmailNode {
  constructor (value, options) {
    this.options = Object.assign(
      {
        containerClassName: 'email-node',
        contentClassName: 'email-node__content',
        removeBtnClassName: 'email-node__remove-email'
      }, options)

    this.value = value
    this.containerNode = document.createElement('div')
    this.containerNode.classList.add(this.options.containerClassName)

    this.contentNode = document.createElement('div')
    this.contentNode.classList.add(this.options.contentClassName)
    this.contentNode.textContent = this.value

    this.removeBtnNode = this._buildRemoveBtn()

    this.containerNode.appendChild(this.contentNode)
    this.containerNode.appendChild(this.removeBtnNode)
  }

  get htmlNode () {
    return this.containerNode
  }

  get isValid () {
    return this.value.indexOf('@') !== -1
  }

  _buildRemoveBtn () {
    const button = document.createElement('div')
    button.classList.add(this.options.removeBtnClassName)
    button.addEventListener('click', (_event) => {
      this.containerNode.remove()
    })
    return button
  }
}
