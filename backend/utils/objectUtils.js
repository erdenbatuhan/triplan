module.exports.isEmpty = (obj) => {
  return !obj || obj.length == 0
}

module.exports.sortObject = (obj, desc=false) => {
  return Object.entries(obj)
    .sort(([,a], [,b]) => (desc ? -1 : 1) * (a - b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}
