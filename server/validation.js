const isValidFullName = (name) => /^[A-Za-z]+ [A-Za-z]+$/.test(String(name || "").trim());
const getLastName = (name) => String(name || "").trim().split(" ")[1] || "";

module.exports = { isValidFullName, getLastName };
