const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

enzyme.configure({ adapter: new Adapter() })

// @ts-ignore
global.fetch = require('node-fetch')
