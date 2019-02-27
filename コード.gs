var moment = Moment.load();
function doPost(e) {
  var webhookData = JSON.parse(e.postData.contents).events[0];
  var message, replyToken, replyText, userId;
  message = webhookData.message.text;
  replyToken = webhookData.replyToken;
  userId = webhookData.source.userId;
  var userDataRow = searchUserDataRow(userId);
  var todo = getTodoCell(userDataRow).getValue();
  var todoDate = getDateCell(userDataRow).getValue();
  switch (message) {
    case '使い方':
      replyText = 'はい！あとで思い出したいことをラインしてくれれば、いつお知らせしてほしいか聞くので、「10分後」「11月23日17時00分」など、教えてください♫その日時にお知らせします。';
      break;
    case 'キャンセル':
      replyText = cancel(userDataRow);
      break;
    case '確認':
      if (todoDate) {
        replyText = '「' + todo + '」を' + todoDate + 'にお知らせする予定だよ！';
      } else {
        replyText = '登録されているリマインダーはありません！';
      }
      break;
    default:
      if (todoDate) {
        replyText = 'ごめん💦リマインダーは1つしか登録できないんだ💦「キャンセル」って言ってくれれば今のリマインダーをやめるよ〜';
      } else if (todo) {
        replyText = setDate(userDataRow, message);
      }
      else {
        replyText = setTodo(userDataRow, message);
      }
  }
  return sendLineMessageFromReplyToken(replyToken, replyText);
}
function searchUserDataRow(userId) {
  userDataRow = searchRowNum(userId, 0);
  if (userDataRow === false) {
    appendToSheet(userId);
  }
  return userDataRow;
}
function setTodo(row, message) {
  setFromRowCol(message, row, 1);
  return '「' + message + ' 」だね！覚えたよ！\nいつ教えてほしい？例：「10分後」「11月23日17時00分」など。「キャンセル」って言ってくれればやめるよ〜';
}
function setDate(row, message) {
  // 全角英数を半角に変換
  message = message.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  var date = Moment.moment(message, 'M月D日H時m分', true).format('YYYY年MM月DD日H時m分');
  if (date === 'Invalid date') {
    var match = message.match(/\d+/g);
    if (match !== null) {
      date = Moment.moment().add(+match[0], 'minutes').format('YYYY年MM月DD日H時m分');
    }
  }
  if (date === 'Invalid date') {
    return 'わかんない！いつ？「キャンセル」って言ってくれればやめるよ〜'
  } else if (date < Moment.moment()) {
    return 'タイムマシンが完成するまで待って！未来の日時で教えてね💦'
  }
  setTrigger(row, date);
  setFromRowCol(date, row, 2);
  return date + 'にお知らせするね！';
}
function cancel(row) {
  getTodoCell(row).clear();
  getDateCell(row).clear();
  triggerCell = getTriggerCell(row)
  var triggerId = triggerCell.getValue();
  if (triggerId) {
    deleteTrigger(triggerId);
  }
  triggerCell.clear();
  return 'またなんかあったら言ってね〜'
}
function remind(e) {
  var userDataRow = searchRowNum(e.triggerUid, 3);
  var userId = getUserIdCell(userDataRow).getValue();
  var todo = getTodoCell(userDataRow).getValue();
  var remindText = '「' + todo + '」の時間だよ！ 気をつけて！';
  cancel(userDataRow);
  return sendLineMessageFromUserId(userId, remindText);
}
