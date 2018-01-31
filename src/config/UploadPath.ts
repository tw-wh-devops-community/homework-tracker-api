export const getUploadPath = () => {
  let uploadPath = './upload/'
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv === 'prod') {
    uploadPath = '/upload/'
  }
  return uploadPath
}
