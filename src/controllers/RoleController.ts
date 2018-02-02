import RoleType from '../models/RoleType'
import { getValues } from '../helpers/EnumHelper'

export const getRoles = (req, res) => {
  const roles = getValues(RoleType)
  return res.json(roles)
}
