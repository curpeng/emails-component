import EmailNode from './EmailNode'

describe('EmailNode', () => {
  it('initializes correctly', () => {
    const component = new EmailNode('hello@gmail.com')
    expect(component).toBeTruthy()
  })

  describe('isValid', () => {
    it('returns true if value contains @', () => {
      const component = new EmailNode('hello@gmail.com')
      expect(component.isValid).toBeTruthy()
    })

    it('returns false if value does not contain @', () => {
      const component = new EmailNode('gmail.com')
      expect(component.isValid).toBeFalsy()
    })
  })

  describe('htmlNode', () => {
    it('returns HtmlElement with container class and remove button', () => {
      const containerClassName = 'container-sdfasdfsdf'
      const removeBtnClassName = 'remove-btn'

      const component = new EmailNode('hello@gmail.com', null, null, { containerClassName, removeBtnClassName })

      document.body.innerHTML = "<div id='test'></div>"

      const testNode = document.querySelector('#test')
      testNode.appendChild(component.htmlNode)

      expect(testNode.querySelectorAll(`.${containerClassName}`).length > 0).toBeTruthy()

      expect(testNode.querySelectorAll(`.${containerClassName} .${removeBtnClassName}`).length > 0).toBeTruthy()
    })
  })
})
