const { createClient } = require("redis")

const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on("error", (err) => {
    console.error("Redis Client Error", err)
})

redis.on("ready", async () => {
    console.log("Redis connected successfully")
//test session 
    await redis.set(
        "session:test-session-123",
        JSON.stringify({
            userId: "test-user-123"
        })
    )

    const session = await redis.get("session:test-session-123")

    console.log("stored session:", session)
})

redis.connect()

module.exports = redis