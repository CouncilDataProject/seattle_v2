const isSubstring = (string = "", substring = "") =>
  string.toLowerCase().indexOf(substring.toLowerCase()) !== -1;

export default isSubstring;
