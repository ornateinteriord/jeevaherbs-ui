import moment from "moment";

export const getFormattedDate = (date: Date | string) => {
    const dateformats =[
        moment.ISO_8601,   // Handles "2025-02-14T19:18:09.013Z"
        "DD/MM/YYYY",      // Handles "21/02/2025"
        "DD-MM-YYYY",      // Handles "22-12-2025"
        "DD MMM , YYYY",   // Handles "20 Feb , 2025"
        "YYYY/MM/DD",      // Handles "2025/02/14"
        "YYYY-MM-DD",      // Handles "2025-02-14"
        "MM/DD/YYYY",      // Handles "02/14/2025" (US format)
        "MMMM D, YYYY",    // Handles "February 14, 2025"
        "MMM D, YYYY",     // Handles "Feb 14, 2025"
        "D MMM YYYY",      // Handles "14 Feb 2025" (without comma)
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ" // Handles "Fri Oct 10 2025 17:45:54 GMT+0530"
    ];
    
    if (!date) return "-";

    // Handle MongoDB Date objects
    if (date instanceof Date) {
        return moment(date).format("DD MMM , YYYY");
    }

    // Handle string dates
    const parsedDate = moment(date, dateformats, true);
    
    // If moment can't parse it, try creating a new Date object
    if (!parsedDate.isValid()) {
        const jsDate = new Date(date);
        if (!isNaN(jsDate.getTime())) {
            return moment(jsDate).format("DD MMM , YYYY");
        }
        return "Invalid Date";
    }
    
    return parsedDate.format("DD MMM , YYYY");
};