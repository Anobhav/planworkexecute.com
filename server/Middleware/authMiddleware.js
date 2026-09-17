const redis = require('../Config/redis')

const authMiddleware = async (req, res, next) => {
    const sessionId = req.cookies.sessionId
    console.log("Session ID received:", sessionId)
    if (!sessionId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const sessionData = await redis.get(`session:${sessionId}`)
        console.log("Session data from Redis:", sessionData)

        if (!sessionData) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsedSessionData = JSON.parse(sessionData)

        const user = parsedSessionData.userId

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        req.user = user

        next()

    } catch (err) {
        next(err)
    }
}
module.exports=authMiddleware