// プロトタイプ拡張
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '')
  }
}

// ltrim
if (!String.prototype.ltrim) {
  String.prototype.ltrim = function (str) {
    return this.replace(/^\s+/g, '')
  }
}

// rtrim
if (!String.prototype.rtrim) {
  String.prototype.rtrim = function (str) {
    return this.replace(/\s+$/g, '')
  }
}

// esccape
if (!String.prototype.esccape) {
  String.prototype.esccape = function () {
    return this
      .replace(/\'/g, "\\'")
      .replace(/\"/g, '\\"')
      .replace(/\//g, '\\/')
      .replace(/\./g, '\\.')
      .replace(/\#/g, '\\#')
  }
}