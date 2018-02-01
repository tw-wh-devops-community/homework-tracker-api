import * as dotenv from 'dotenv'

export class EnvHelper {
  private env: any

  constructor() {
    this.getBasicEnvData()
  }

  public getNodeEnv() {
    return this.env.NODE_ENV
  }

  public getEnvProperty(key: string) {
    return this.env[`${key}`]
  }

  private getBasicEnvData() {
    dotenv.config()
    this.env = process.env
  }
}

export default new EnvHelper()
