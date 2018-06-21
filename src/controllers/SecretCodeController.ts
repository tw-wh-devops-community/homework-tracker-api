import {SecretCode, SecretCodeModel} from '../models/SecretCode'

export const updateSecretCode = async (req, res) => {
    const code = req.body.secret_code.toUpperCase()

    const query = {'name': 'secret_code'}
    const update = {'code': code}
    await SecretCode.findOneAndUpdate(query, update).exec()
    res.status(200).json({'message': 'update secret_code successfully!'})
}

export const insertSecretCode = async (req, res) => {
    const code = req.body.secret_code.toUpperCase()

    const existSecretCode: SecretCodeModel = await SecretCode.findOne({'name': 'secret_code'}).exec()

    if (existSecretCode != null) {
        res.status(400).json({'message': 'SecretCode is already existing!'})
        return
    }

    const secretCode = new SecretCode({'name': 'secret_code', 'code': code})
    await secretCode.save()
    res.status(200).json({'message': 'insert successfully!'})
}
