import SystemSettings from "../features/superAdmin/models/SystemSettingsModel.js";

export const maintenanceMiddleware = async (req, res, next) => {
    try {
        const settings = await SystemSettings.findOne();

       
        if (settings?.maintenanceMode) {

            const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super-admin");

            if (!isAdmin) {

                const publicPaths = ["/api/auth/login", "/api/super-admin/settings"];
                const isPublicPath = publicPaths.some(path => req.path.startsWith(path));

                if (!isPublicPath) {
                    return res.status(503).json({
                        error: "Maintenance",
                        message: "The site is currently undergoing maintenance. Please try again later.",
                        maintenanceMode: true
                    });
                }
            }
        }

        next();
    } catch (error) {
        console.error("Maintenance Middleware Error:", error);
        next(); // Proceed if we can't check settings, don't block the site
    }
};
