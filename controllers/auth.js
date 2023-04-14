const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')

const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {

    const user = await User.create({ ...req.body })

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({user: { name: user.name, password: user.password}, token})
}

const login = async (req, res) => {

    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Provide valid credentials!')
    }

    const isCorrectPass = await user.comparePassword(password)

    if(!isCorrectPass){
        throw new UnauthenticatedError('Please provide correct password')
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user: {name: user}, token})

}

module.exports = {
    register,
    login,
}
