// String.prototype.replaceAll = function(search, replacement) {
//     var target = this;
//     return target.replace(new RegExp(search, 'g'), replacement);
// };

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    var newString = target.replace(new RegExp(`\\${search}`, 'g'), replacement);
    return newString.replaceAll1(search, replacement);
};

String.prototype.replaceAll1 = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.parseBoolean = function (defaultValue = false) {
    if (!this) return defaultValue;
    if (this.toString().toLowerCase() == 'true') {
        return true;
    } else if (this.toString().toLowerCase() == 'false') {
        return false;
    } else {
        return defaultValue;
    }
};