import * as chai from 'chai'
import chaiHttp = require('chai-http')

import app from '../../../src/App'

chai.use(chaiHttp)
const expect = chai.expect

describe('image Route', () => {

  it('should get 404 when the provided employee id not found corresponding image ', () => {
    return chai.request(app).get('/image/12345')
      .then(()=>{},res=>{
        expect(res.status).to.eql(404)
      })
  })

  it('should get the image when the provided employee id can find corresponding image ', () => {
    return chai.request(app).get('/image/15111')
      .then(res => {
        expect(res.header['content-type']).to.eql('image/jpeg')
        expect(res.status).to.eql(200)
      })
  })
})
