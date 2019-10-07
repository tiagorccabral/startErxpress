
// Cleanstring helper used to remove whitecharacters from beginning or end of string. Also lowers all cases
export const cleanString = string =>
  string
    .replace(/\s+/g, '')
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase();