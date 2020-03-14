import EmailsInput from './EmailsInput'

describe('EmailsInput', () => {
  it('initializes correctly', () => {
    const container = document.createElement('div')
    const component = new EmailsInput(container, { onChange: () => ({}) })
    expect(component).toBeTruthy()
  })
})
