const prisma = require("../Config/prisma")

const addProductivity = async (req, res, next) => {
    const subjectId = req.body.subjectId
    const date = req.body.date
    const minutes = req.body.minutes

    if (
        !subjectId ||
        !date ||
        minutes === undefined ||
        typeof minutes !== "number" ||
        minutes <= 0
    ) {
        return res.status(400).json({
            message: "Invalid data sent to the backend"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: "Date must be in YYYY-MM-DD format"
        })
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)

    if (
        parsedDate.getUTCFullYear() !== Number(date.slice(0, 4)) ||
        parsedDate.getUTCMonth() + 1 !== Number(date.slice(5, 7)) ||
        parsedDate.getUTCDate() !== Number(date.slice(8, 10))
    ) {
        return res.status(400).json({
            message: "Invalid date"
        })
    }

    const year = parsedDate.getUTCFullYear()
    const month = parsedDate.getUTCMonth() + 1
    const day = parsedDate.getUTCDate()

    const userId = req.user

    try {
        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                userId: userId
            }
        })

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            })
        }

        const productivityMonth = await prisma.productivityMonth.findUnique({
            where: {
                userId_year_month: {
                    userId: userId,
                    year: year,
                    month: month
                }
            }
        })

        if (!productivityMonth) {
            const newProductivityMonth =
                await prisma.productivityMonth.create({
                    data: {
                        userId: userId,
                        year: year,
                        month: month,
                        data: {
                            [day]: [
                                {
                                    subjectId: subjectId,
                                    subjectName: subject.subjectname,
                                    minutes: minutes
                                }
                            ]
                        }
                    }
                })

            return res.status(201).json({
                message: "Productivity added successfully",
                data: newProductivityMonth
            })
        }

        const existingData = productivityMonth.data

        if (!existingData[day]) {
            existingData[day] = [
                {
                    subjectId: subjectId,
                    subjectName: subject.subjectname,
                    minutes: minutes
                }
            ]
        } else {
            const existingSubject = existingData[day].find(
                (item) => item.subjectId === subjectId
            )

            if (!existingSubject) {
                existingData[day].push({
                    subjectId: subjectId,
                    subjectName: subject.subjectname,
                    minutes: minutes
                })
            } else {
                existingSubject.minutes += minutes
            }
        }

        const updatedProductivityMonth =
            await prisma.productivityMonth.update({
                where: {
                    id: productivityMonth.id
                },
                data: {
                    data: existingData
                }
            })

        return res.status(200).json({
            message: "Productivity added successfully",
            data: updatedProductivityMonth
        })

    } catch (err) {
        return next(err)
    }
}


const editProductivity = async (req, res, next) => {
    const subjectId = req.body.subjectId
    const date = req.body.date
    const minutes = req.body.minutes

    if (
        !subjectId ||
        !date ||
        typeof minutes !== "number" ||
        minutes <= 0
    ) {
        return res.status(400).json({
            message: "Invalid value"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: "Date must be in YYYY-MM-DD format"
        })
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)

    if (
        parsedDate.getUTCFullYear() !== Number(date.slice(0, 4)) ||
        parsedDate.getUTCMonth() + 1 !== Number(date.slice(5, 7)) ||
        parsedDate.getUTCDate() !== Number(date.slice(8, 10))
    ) {
        return res.status(400).json({
            message: "Invalid date"
        })
    }

    const year = parsedDate.getUTCFullYear()
    const month = parsedDate.getUTCMonth() + 1
    const day = parsedDate.getUTCDate()

    const userId = req.user

    try {
        const subjectExists = await prisma.subject.findFirst({
            where: {
                userId: userId,
                id: subjectId
            }
        })

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject does not exist"
            })
        }

        const productivityMonth =
            await prisma.productivityMonth.findUnique({
                where: {
                    userId_year_month: {
                        userId: userId,
                        year: year,
                        month: month
                    }
                }
            })

        if (!productivityMonth) {
            return res.status(404).json({
                message: "Productivity record not found"
            })
        }

        const existingData = productivityMonth.data

        if (!existingData[day]) {
            return res.status(404).json({
                message: "No productivity record found for this date"
            })
        }

        const existingSubject = existingData[day].find(
            (item) => item.subjectId === subjectId
        )

        if (!existingSubject) {
            return res.status(404).json({
                message: "Subject record not found"
            })
        }

        existingSubject.minutes = minutes

        const updatedProductivityMonth =
            await prisma.productivityMonth.update({
                where: {
                    id: productivityMonth.id
                },
                data: {
                    data: existingData
                }
            })

        return res.status(200).json({
            message: "Value updated successfully",
            data: updatedProductivityMonth
        })

    } catch (err) {
        return next(err)
    }
}


const deleteProductivity = async (req, res, next) => {
    const userId = req.user
    const subjectId = req.body.subjectId
    const date = req.body.date

    if (!subjectId || !date) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: "Date must be in YYYY-MM-DD format"
        })
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)

    if (
        parsedDate.getUTCFullYear() !== Number(date.slice(0, 4)) ||
        parsedDate.getUTCMonth() + 1 !== Number(date.slice(5, 7)) ||
        parsedDate.getUTCDate() !== Number(date.slice(8, 10))
    ) {
        return res.status(400).json({
            message: "Invalid date"
        })
    }

    const year = parsedDate.getUTCFullYear()
    const month = parsedDate.getUTCMonth() + 1
    const day = parsedDate.getUTCDate()

    try {
        const subjectExists = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                userId: userId
            }
        })

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject does not exist"
            })
        }

        const productivityMonth =
            await prisma.productivityMonth.findUnique({
                where: {
                    userId_year_month: {
                        userId: userId,
                        year: year,
                        month: month
                    }
                }
            })

        if (!productivityMonth) {
            return res.status(404).json({
                message: "Productivity record not found"
            })
        }

        const existingData = productivityMonth.data

        if (!existingData[day]) {
            return res.status(404).json({
                message: "No productivity record found for this date"
            })
        }

        const updatedDayData = existingData[day].filter(
            (item) => item.subjectId !== subjectId
        )

        if (updatedDayData.length === existingData[day].length) {
            return res.status(404).json({
                message: "Subject productivity record not found"
            })
        }

        if (updatedDayData.length === 0) {
            delete existingData[day]
        } else {
            existingData[day] = updatedDayData
        }

        const updatedProductivityMonth =
            await prisma.productivityMonth.update({
                where: {
                    id: productivityMonth.id
                },
                data: {
                    data: existingData
                }
            })

        return res.status(200).json({
            message: "Productivity deleted successfully",
            data: updatedProductivityMonth
        })

    } catch (err) {
        return next(err)
    }
}


const getDailyProductivity = async (req, res, next) => {
    const userId = req.user
    const date = req.body.date

    if (!date) {
        return res.status(400).json({
            message: "Date is required"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(date)) {
        return res.status(400).json({
            message: "Date must be in YYYY-MM-DD format"
        })
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)

    if (
        parsedDate.getUTCFullYear() !== Number(date.slice(0, 4)) ||
        parsedDate.getUTCMonth() + 1 !== Number(date.slice(5, 7)) ||
        parsedDate.getUTCDate() !== Number(date.slice(8, 10))
    ) {
        return res.status(400).json({
            message: "Invalid date"
        })
    }

    const year = parsedDate.getUTCFullYear()
    const month = parsedDate.getUTCMonth() + 1
    const day = parsedDate.getUTCDate()

    try {
        const productivityMonth =
            await prisma.productivityMonth.findUnique({
                where: {
                    userId_year_month: {
                        userId: userId,
                        year: year,
                        month: month
                    }
                }
            })

        if (!productivityMonth) {
            return res.status(404).json({
                message: "No productivity record found for this month"
            })
        }

        const dailyProductivity = productivityMonth.data[day]

        if (!dailyProductivity) {
            return res.status(404).json({
                message: "No productivity record found for this date"
            })
        }

        const totalMinutes = dailyProductivity.reduce(
            (total, item) => total + item.minutes,
            0
        )

        return res.status(200).json({
            message: "Daily productivity fetched successfully",
            data: {
                date: date,
                subjects: dailyProductivity,
                totalMinutes: totalMinutes
            }
        })

    } catch (err) {
        return next(err)
    }
}


const getSubjectProductivity = async (req, res, next) => {
    const userId = req.user
    const subjectId = req.body.subjectId
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    if (!subjectId || !startDate || !endDate) {
        return res.status(400).json({
            message: "subjectId, startDate and endDate are required"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({
            message: "Dates must be in YYYY-MM-DD format"
        })
    }

    const parsedStartDate = new Date(`${startDate}T00:00:00.000Z`)
    const parsedEndDate = new Date(`${endDate}T00:00:00.000Z`)

    const validStartDate =
        parsedStartDate.getUTCFullYear() === Number(startDate.slice(0, 4)) &&
        parsedStartDate.getUTCMonth() + 1 === Number(startDate.slice(5, 7)) &&
        parsedStartDate.getUTCDate() === Number(startDate.slice(8, 10))

    const validEndDate =
        parsedEndDate.getUTCFullYear() === Number(endDate.slice(0, 4)) &&
        parsedEndDate.getUTCMonth() + 1 === Number(endDate.slice(5, 7)) &&
        parsedEndDate.getUTCDate() === Number(endDate.slice(8, 10))

    if (
        !validStartDate ||
        !validEndDate ||
        parsedStartDate > parsedEndDate
    ) {
        return res.status(400).json({
            message: "Invalid date range"
        })
    }

    try {
        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                userId: userId
            }
        })

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            })
        }

        const productivityMonths =
            await prisma.productivityMonth.findMany({
                where: {
                    userId: userId
                },
                orderBy: [
                    { year: "asc" },
                    { month: "asc" }
                ]
            })

        let totalMinutes = 0
        const productivityHistory = []

        for (const productivityMonth of productivityMonths) {
            const data = productivityMonth.data

            for (const day in data) {
                const currentDate =
                    `${productivityMonth.year}-${String(productivityMonth.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                if (currentDate < startDate || currentDate > endDate) {
                    continue
                }

                const subjectData = data[day].find(
                    (item) => item.subjectId === subjectId
                )

                if (subjectData) {
                    totalMinutes += subjectData.minutes

                    productivityHistory.push({
                        date: currentDate,
                        minutes: subjectData.minutes
                    })
                }
            }
        }

        return res.status(200).json({
            message: "Subject productivity fetched successfully",
            data: {
                subjectId: subjectId,
                subjectName: subject.subjectname,
                totalMinutes: totalMinutes,
                history: productivityHistory
            }
        })

    } catch (err) {
        return next(err)
    }
}


const getProductivityHistory = async (req, res, next) => {
    const userId = req.user
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    if (!startDate || !endDate) {
        return res.status(400).json({
            message: "startDate and endDate are required"
        })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/

    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({
            message: "Dates must be in YYYY-MM-DD format"
        })
    }

    const parsedStartDate = new Date(`${startDate}T00:00:00.000Z`)
    const parsedEndDate = new Date(`${endDate}T00:00:00.000Z`)

    const validStartDate =
        parsedStartDate.getUTCFullYear() === Number(startDate.slice(0, 4)) &&
        parsedStartDate.getUTCMonth() + 1 === Number(startDate.slice(5, 7)) &&
        parsedStartDate.getUTCDate() === Number(startDate.slice(8, 10))

    const validEndDate =
        parsedEndDate.getUTCFullYear() === Number(endDate.slice(0, 4)) &&
        parsedEndDate.getUTCMonth() + 1 === Number(endDate.slice(5, 7)) &&
        parsedEndDate.getUTCDate() === Number(endDate.slice(8, 10))

    if (
        !validStartDate ||
        !validEndDate ||
        parsedStartDate > parsedEndDate
    ) {
        return res.status(400).json({
            message: "Invalid date range"
        })
    }

    try {
        const productivityMonths =
            await prisma.productivityMonth.findMany({
                where: {
                    userId: userId
                },
                orderBy: [
                    { year: "asc" },
                    { month: "asc" }
                ]
            })

        const history = []

        for (const productivityMonth of productivityMonths) {
            const data = productivityMonth.data

            for (const day in data) {
                const currentDate =
                    `${productivityMonth.year}-${String(productivityMonth.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                if (currentDate < startDate || currentDate > endDate) {
                    continue
                }

                const subjects = data[day]

                const totalMinutes = subjects.reduce(
                    (total, item) => total + item.minutes,
                    0
                )

                history.push({
                    date: currentDate,
                    subjects: subjects,
                    totalMinutes: totalMinutes
                })
            }
        }

        return res.status(200).json({
            message: "Productivity history fetched successfully",
            data: history
        })

    } catch (err) {
        return next(err)
    }
}


module.exports = {
    addProductivity,
    editProductivity,
    deleteProductivity,
    getDailyProductivity,
    getSubjectProductivity,
    getProductivityHistory
}