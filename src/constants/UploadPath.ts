import ENV from './Env'

export const getUploadPath = () => {
  let uploadPath = './upload/'
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv === ENV.PROD) {
    uploadPath = '/upload/'
  }
  return uploadPath
}
