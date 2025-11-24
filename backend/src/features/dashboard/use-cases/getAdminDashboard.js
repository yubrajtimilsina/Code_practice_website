export const getAdminDashboard = async() => {
    return {
        message : `Welcome to the admin dashboard!`,
        stats : {
            totalUsers: 0,
            totalProblems: 0,
            totalSubmissions:0
        }  
    };
};
