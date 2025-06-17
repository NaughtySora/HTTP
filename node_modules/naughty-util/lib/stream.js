"use strict";

const read = async (readable) => {
  const result = [];
  for await (const chuck of readable) result.push(chuck);
  return Buffer.concat(result);
};

module.exports = {
  read,
};
