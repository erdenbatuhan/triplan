const isEmpty = (obj) => {
  return !obj || obj.length == 0
}

const sortObject = (obj, desc=false) => {
  return Object.entries(obj)
    .sort(([,a], [,b]) => (desc ? -1 : 1) * (a - b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

const average = (lst) => (sum(lst) / lst.length) || 0;
const sum = (lst) => lst.reduce((accum, current) => accum + current, 0);

module.exports = { isEmpty, sortObject, average, sum };
