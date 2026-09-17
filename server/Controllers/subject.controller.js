const prisma = require("../Config/prisma")

const getsubjects = async (req, res, next) => {
    const userId = req.user

    try {
        const userSubjects = await prisma.subject.findMany({
            where: {
                userId: userId
            }
        })

        return res.status(200).json({
            message: "Subjects fetched successfully",
            userSubjects: userSubjects
        })

    } catch (err) {
        return next(err)
    }
}

const createsubject = async (req, res,next) => {
    const usersubjectname=req.body.subjectname
    if (!usersubjectname || typeof usersubjectname !== "string") {
        return res.status(400).json({
            message: "Subject name is required"
        })
    }
    const cleanSubjectName=usersubjectname.trim()
    if(!cleanSubjectName){
        return res.status(400).json({
            message:"Subject name is required"
        })
    }
    const userId=req.user
    try{
        const subjectcount=await prisma.subject.count({
                        where:{
                            userId:userId
                        }
                    })
    
    if (subjectcount>=4){
        return res.status(403).json({
            message:"Sorry adding more than 4 subjects is not allowed"
        })
    }
        const newSubject=await prisma.subject.create({
        data:{
            userId: userId,
            subjectname: cleanSubjectName
        }
    })
    return res.status(201).json({
        subject:newSubject,
        message:"Subject Added"
    })

    }
    catch(err){
        return next(err)
    }
}

const updatesubject = async (req, res, next) => {
    const userId = req.user
    const subjectId = req.params.id
    const newSubjectName = req.body.subjectname

    if (!newSubjectName || typeof newSubjectName !== "string") {
        return res.status(400).json({
            message: "Subject name is empty"
        })
    }

    const cleanSubjectName = newSubjectName.trim()

    if (!cleanSubjectName) {
        return res.status(400).json({
            message: "Subject name is empty"
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

        const updatedSubject = await prisma.subject.update({
            where: {
                id: subjectId
            },
            data: {
                subjectname: cleanSubjectName
            }
        })

        return res.status(200).json({
            message: "Subject updated successfully",
            subject: updatedSubject
        })

    } catch (err) {
        return next(err)
    }
}

const deletesubject = async (req, res,next) => {
    const subjectid=req.params.id
    const userid=req.user
    try {
        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectid,
                userId: userid
            }
        })

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            })
        }
        const deletedSubject = await prisma.subject.delete({
            where: {
                id: subjectid
            }
        })
        return res.status(200).json({
            message: "Subject deleted successfully",
            subject: deletedSubject
        })


    }catch(err){
        return next(err)
    }
}

module.exports={getsubjects,createsubject,updatesubject,deletesubject}