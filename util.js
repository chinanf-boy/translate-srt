function insert_flg(str, flg, Uindex) {
  Uindex = Uindex + 1;
  let newstr = '';
  if (!str || !flg) {
    throw TypeError('filename<' + str + '> can not add' + flg);
  }
  let len = str.length;
  let tmp = str.substring(0, len - Uindex);
  newstr = tmp + flg + str.substring(len - Uindex, len);
  return newstr;
}

module.exports = {
  insert_flg
};
