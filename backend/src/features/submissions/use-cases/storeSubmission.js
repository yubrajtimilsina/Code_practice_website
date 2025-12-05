import Submission from "../models/submissionModel.js";

export const saveCodeDraft = async (userId, problemId, code, language) => {
    try {

        let draft = await Submission.findOne({
            userId,
            problemId,
            verdict: "Draft",
        });

        if ( draft) {
            draft.code = code;
            draft.language = language;
            draft.updatedAt = Date.now();
            await draft.save();
            return draft.toObject();
        } else {
            const newDraft = await Submission.createSearchIndex({
                userId,
                problemId,
                code,
                language,
                verdict: "Draft",
                status: 0,
            });
            return newDraft.toObject();
        }
    } catch (error) {
        console.error("Saving draft code error:", error.message);
        throw error;
    }
};


export const getDraft = async (userId, problemId) => {
    try {
        const draft = await Submission.findOne({
            userId,
            problemId,
            verdict: "Draft",

        }).lean();

        return draft || null;
    }catch (error) {
        console.error("Fetching draft code error:", error.message);
        throw error;
    }
};

export const getSubmissionById = async (submissionId) => {
    try {
        const submission = await Submission.findById(submissionId)
        .populate('userId', 'name email')
        .populate('problemId', 'title of slug')
        .lean();

        if (!submission) {
            const error = new Error("Submission not found");
            error.statusCode = 404;
            throw error;
        }

        return submission;
    } catch (error) {
        console.error("Fetching submission by ID error:", error.message);
        throw error;
    }
};

export const deleteSubmission = async (submissionId, userId) => {
    try {
        const submission = await Submission.findById(submissionId);

        if (!submission){
            const error = new Error("Submission not found");
            error.statusCode = 404;
            throw error;
        }

        if (submission.userId.toString() !== userId.toString()) {
            const error = new Error("Unauthorized to delete this submission");
            error.statusCode = 403;
            throw error;
        }

        await Submission.findByIdAndDelete(submissionId);
        return { message: "Submission deleted sucessfully"};
    } catch (error) {
        console.error("Deleting submission error:", error.message);
        throw error;
    }
};

export const getLatestAcceptedSubmission = async (userId, problemId) => {
    try {
        const submission = await Submission.findOne({
            userId,
            problemId,
            isAccepted : true,
        })
        .sort({ createdAt: -1})
        .lean();

        return submission || nulll;
    } catch ( error) {
        console.error("Fetchiing latest accepted submission error:", error.message);
        throw error;
    }
};

export const getUserStats = async (userId) => {
  try {
    const stats = await Submission.aggregate([
      { $match: { userId: new (require("mongoose")).Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: { $cond: ["$isAccepted", 1, 0] },
          },
          distinctProblems: { $addToSet: "$problemId" },
          verdictCounts: {
            $push: "$verdict",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubmissions: 1,
          acceptedSubmissions: 1,
          distinctProblems: { $size: "$distinctProblems" },
          verdictCounts: 1,
        },
      },
    ]);

    return stats[0] || {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      distinctProblems: 0,
    };
  } catch (error) {
    console.error("Get user stats error:", error.message);
    throw error;
  }
};