let one = 0; // Persistent counter across requests
let resetInProgress = false; // Prevent multiple resets

// Middleware for counter logic
const counterMiddleware = (req, res, next) => {
    if (one >= 4) {
        if (!resetInProgress) {
            resetInProgress = true;
            console.log("Reset will occur in 5 seconds.");

            setTimeout(() => {
                one = 0;
                resetInProgress = false;
                console.log("Counter reset.");
            }, 5000); // 5-second delay
        }

        // Improved error response for better client understanding
        return res.status(429).json({
            error: "Too Many Requests",
            message: "Please wait a few seconds before trying again. because user try Too Many Requests just wait 5 second",
            retryAfter: 5 // Recommended delay (in seconds)
        });
    }

    req.counterValue = one; // Track counter value in request object
    one++;
    next(); // Continue to the next middleware
};

module.exports = counterMiddleware;