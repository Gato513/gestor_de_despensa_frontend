export const confirmAccessRoute = (role) => {
    if (role !== "admin") {
        window.location.href = "/panel";
        return false
    }

    return true;
};