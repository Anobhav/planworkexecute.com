const { createClient } = require("redis")
const prisma = require("./prisma")

const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on("error", (err) => {
    console.error("Redis Client Error", err)
})

redis.on("ready", async () => {
    console.log("Redis connected successfully")

    const testUser = await prisma.user.findUnique({
        where: {
            email: "testuser@example.com"
        }
    })

    console.log("Test user ID:", testUser.id)

    await redis.set(
        "session:test-session-123",
        JSON.stringify({
            userId: testUser.id
        })
    )

    const session = await redis.get("session:test-session-123")

    console.log("Stored session:", session)
})

redis.connect()

module.exports = redis