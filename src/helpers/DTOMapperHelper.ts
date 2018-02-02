import * as _ from 'lodash'

const getDTOFromModel = (obj, properties) => {
  const dtoObject = _.pick(obj, properties)
  dtoObject.id = obj._id
  return dtoObject
}

export default getDTOFromModel
