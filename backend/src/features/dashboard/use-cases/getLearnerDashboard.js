

export const getLearnerDashboard = async(userId) => {
    return {
        message : `Welcome to the learner dashboard, user ${userId}!`,
        stats : {
            solvedProblems: 0,
            submissions: 0,
            rank:0
        }  
    
    };
};