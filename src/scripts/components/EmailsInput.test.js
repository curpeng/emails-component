import EmailsInput from './EmailsInput'

describe('EmailsInput', () => {
  it('initializes correctly', () => {
    const container = document.createElement('div')
    const component = new EmailsInput(container, { onChange: () => ({}) })
    expect(component).toBeTruthy()
  })

  describe('addValue', () => {
    beforeEach(() => {
      document.body.innerHTML = "<div id='test'></div>"
    })

    it('adds html node with added value', () => {
      const inputContainerNode = document.querySelector('#test')
      const currentNodeClassName = 'test-current-node'

      const component = new EmailsInput(inputContainerNode, { currentNodeClassName })

      expect(inputContainerNode.querySelectorAll(`.${currentNodeClassName}`).length === 1).toBeTruthy()

      const newEmail = 'test@gmail.com '
      component.addValue(newEmail)

      const htmlEl = inputContainerNode.querySelector('.email-node__content')

      expect(htmlEl.textContent).toEqual(newEmail)
    })
  })
})
