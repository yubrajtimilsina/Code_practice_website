import SystemSettings from "../features/superAdmin/models/SystemSettingsModel.js";

export const maintenanceMiddleware = async (req, res, next) => {
    try {
        const settings = await SystemSettings.findOne();


        if (settings?.maintenanceMode) {

            const isSuperAdmin = req.user && req.user.role === "super-admin";

            if (!isSuperAdmin) {

                const publicPaths = ["/api/auth", "/api/super-admin/settings"];
                const isPublicPath = publicPaths.some(path => req.originalUrl.startsWith(path));

                if (!isPublicPath) {
                    return res.status(503).json({
                        error: "Maintenance",
                        message: "The site is currently undergoing maintenance. Only Super Admins can access at this time.",
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
