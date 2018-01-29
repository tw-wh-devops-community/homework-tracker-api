import * as chai from 'chai'
import { Interviewer } from '../../../src/models/Interviewer'
import { roleType} from '../../../src/helpers/Constant';
import { resetDB } from '../../db-test-setup'

const expect = chai.expect
describe('interviewer model test', () => {
  afterEach(async () => {
    await resetDB()
  })

  it('should get the saved interviewer info', async () => {
    const interviewer = new Interviewer({name: 'foo',  employee_id: 'bar', role:roleType.BA})
    const savedInterviewer = await interviewer.save()
    const picBathUrl ='fakeStorePicBathUrl'

    const latestInterviewer = await Interviewer.findById(savedInterviewer.id)

    expect(latestInterviewer.name).to.eql('foo')
    expect(latestInterviewer.role).to.eql(roleType.BA)
    expect(latestInterviewer.getPicUrl()).to.eql(`${picBathUrl}bar`)
  })
})
