var spreadsheet = SpreadsheetApp.openById("スプレッドシートID");
function appendToSheet(text){
 var sheet = spreadsheet.getSheetByName('webhook');
 sheet.appendRow([text]);
}

function doGet() {
 appendToSheet("test")
}

function doPost(e) {
 var webhookData = JSON.parse(e.postData.contents).events[0];
 var message,replyToken;
 message = webhookData.message.text;
 replyToken = webhookData.replyToken;
 return sendLineMessageFromReplyToken(replyToken,message);
}

var channel_access_token = "アクセストークン";

function sendLineMessageFromReplyToken(token,replyText){
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type" : "application/json; charset=UTF-8",
   "Authorization" : "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken" : token,
   "messages" : [{
     "type" : "text",
     "text" : replyText
   }]
 };
 var options = {
   "method" : "POST",
   "headers" : headers,
   "payload" : JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
