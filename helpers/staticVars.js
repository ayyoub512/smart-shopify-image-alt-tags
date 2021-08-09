/**
 * FIRST_TIME : The very first run
 * IN_PROGRESS : last run in still in progress
 * SUCCEEDED : last run succeeded
 * FAILED : last run failed
 * NEW_FIRST_TIME : when the customer wants to change the alt value and rerun the operation,
 *     and probably will also do this for failed operations
 */
// exports.FIRST_TIME = "FIRST_TIME";
// exports.RERUN = "NEW_FIRST_RU3N3";
// exports.IN_PROGRESS = "IN_PROGRESS";
// exports.SUCCEEDED = "SUCCEEDED";
// exports.FAILED = "FAILED";

module.exports = {
    operationStatus: {
        FIRST_TIME: "FIRST_TIME",
        RERUN: "RERUN",
        IN_PROGRESS: "IN_PROGRESS",
        SUCCEEDED: "SUCCEEDED",
        FAILED: "FAILED",
    },
};
