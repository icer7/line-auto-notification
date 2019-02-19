var spreadsheet = SpreadsheetApp.openById("スプレッドシートのID");
var sheet = spreadsheet.getSheetByName('webhook');
function appendToSheet(text) {
 sheet.appendRow([text]);
}
function searchRowNum(searchVal, col) {
 //受け取ったシートのデータを二次元配列に取得
 var dat = sheet.getDataRange().getValues();
 for (var i = 0; i < dat.length; i++) {
   if (dat[i][col] === searchVal) {
     return i;
   }
 }
 return false;
}
function getFromRowCol(sheetName, row, col) {
 var dat = sheet.getDataRange().getValues();
 return dat[row][col];
}
function setFromRowCol(val, row, col) {
 sheet.getRange(row + 1, col + 1).setValue(val);
}
function getUserIdCell(row) {
 return sheet.getRange(row + 1, 1);
}
function getTodoCell(row) {
 return sheet.getRange(row + 1, 2);
}
function getDateCell(row) {
 return sheet.getRange(row + 1, 3);
}
function getTriggerCell(row) {
 return sheet.getRange(row + 1, 4);
}
