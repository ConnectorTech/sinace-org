const fs = require('fs');
let sql = fs.readFileSync('drizzle/schema_clean.sql', 'utf8');
sql = sql.replace(/CONSTRAINT `([^`]+)`/g, (match, name) => {
  if (name.length > 64) {
    const newName = name.substring(0, 30) + '_' + name.substring(name.length - 30);
    return 'CONSTRAINT `' + newName + '`';
  }
  return match;
});
fs.writeFileSync('drizzle/schema_clean.sql', sql);
