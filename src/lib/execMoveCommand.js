"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execMoveCommand = execMoveCommand;
var child_process_1 = require("child_process");
/**
 * Executes a Unix mv command to move files or directories.
 * @param source Source file or directory path
 * @param destination Destination path
 * @param options Options for force/verbose
 */
function execMoveCommand(source, destination, options) {
    if (options === void 0) { options = {}; }
    var cmd = 'mv';
    if (options.force)
        cmd += ' -f';
    cmd += " \"".concat(source, "\" \"").concat(destination, "\"");
    if (options.verbose) {
        // eslint-disable-next-line no-console
        console.log("[execMoveCommand] Executing: ".concat(cmd));
    }
    try {
        (0, child_process_1.execSync)(cmd, { stdio: 'inherit' });
    }
    catch (err) {
        if (options.verbose) {
            // eslint-disable-next-line no-console
            console.error("[execMoveCommand] Error:", err);
        }
        throw err;
    }
}
