const mondaiList = require('../constants/mondaiList.json');

module.exports = function(stringMondai) {
  let returnValue = [];
  const mondai = parseInt(stringMondai / 1000);
  const entries = Object.entries(mondaiList);
  for (const [key, value] of entries) {
    if (mondai == key) returnValue = [...value];
  }
  return returnValue;
};
