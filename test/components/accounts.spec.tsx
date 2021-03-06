// import React from 'react'
// import knex from 'knex'
// import App from '../../ui/js/containers/App'
// import {
//   NEW_USER_EMAIL,
//   NEW_USER_PASSWORD,
//   API_HOST,
//   API_PORT,
//   API_PROTOCOL,
//   NEW_USER_UPDATED_PASSWORD,
//   connection,
// } from '../constants'
// import {
//   render,
//   cleanup,
//   Matcher,
//   SelectorMatcherOptions,
//   fireEvent,
//   wait,
// } from '../setup/testUtils'
// // import { getDbClient() } from '../../server/database'

// let getById: (text: any, options?: any) => HTMLElement
// let getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
// export const getDbClient() = knex({ client: 'pg', connection })

// describe('Account tests', () => {
//   beforeAll(async () => {
//     // Set up test account
//     await getDbClient()
//       .delete()
//       .from('users')
//       .where({ username: NEW_USER_EMAIL })

//     await fetch(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/create`, {
//       body: JSON.stringify({
//         username: NEW_USER_EMAIL,
//         password: NEW_USER_UPDATED_PASSWORD,
//       }),
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       redirect: 'manual',
//     })

//     const dbCreateUserCheck = await getDbClient()
//       .select('*')
//       .from('users')
//       .where({ username: NEW_USER_EMAIL })
//     expect(dbCreateUserCheck.length).toBe(1)

//     const confirmationString: string = dbCreateUserCheck[0].confirmationString.trim()
//     const confirmationURL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/confirm/${confirmationString}`

//     await fetch(confirmationURL, {
//       redirect: 'manual',
//     })
//   })

//   beforeEach(async () => {
//     ;({ getById, getByText } = render(<App></App>))

//     const userInput = getById('sign-in-user') as HTMLInputElement
//     const passwordInput = getById('sign-in-password') as HTMLInputElement
//     const signInButton = getById('sign-in-button') as HTMLButtonElement

//     fireEvent.change(userInput, { target: { value: NEW_USER_EMAIL } })
//     fireEvent.change(passwordInput, { target: { value: NEW_USER_PASSWORD } })
//     fireEvent.click(signInButton)

//     await wait(() => getByText('Log Out'))
//   })

//   afterEach(cleanup)

//   afterAll(async () => {
//     await getDbClient()
//       .delete()
//       .from('users')
//       .where({ username: NEW_USER_EMAIL })
//     getDbClient().destroy()
//   })

//   test('Add account flow', async () => {
//     // TODO
//     await wait(() => getByText('Add Institution'))
//     fireEvent.click(getByText('Add Institution'))
//   })
// })
