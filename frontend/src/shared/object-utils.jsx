export const sum = (lst) => lst.reduce((accum, current) => accum + current, 0);
export const average = (lst) => sum(lst) / lst.length || 0;
