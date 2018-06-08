import { OpenIdBindModel } from '../models/OpenIdBind'

export interface OpenIdBindDTO {
  is_bind: boolean,
  bind_info: OpenIdBindModel
}
