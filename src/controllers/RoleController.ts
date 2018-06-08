import RoleType from '../models/RoleType'
import { getValues } from '../helpers/EnumHelper'

export const getRoles = (req, res) => {
  const roles = getValues(RoleType)
  console.info('get role method.')
  return res.json(roles)
}
