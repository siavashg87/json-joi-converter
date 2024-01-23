"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexToString = void 0;
function regexToString(regex) {
    var str = regex.toString();
    var lastSlash = str.lastIndexOf('/');
    var output = {
        $regex: str.substr(1, lastSlash - 1)
    };
    if (str.length > (lastSlash + 1))
        output.flags = str.substr(lastSlash + 1, 10);
    return output;
}
exports.regexToString = regexToString;
