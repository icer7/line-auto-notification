function setTrigger(row, date) {
  var triggerDay = moment(date,'YYYY年MM月DD日H時m分').toDate();
  var trigger =  ScriptApp.newTrigger("remind").timeBased().at(triggerDay).create();
  setFromRowCol(trigger.getUniqueId(), row, 3);
}
function deleteTrigger(uniqueId) {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getUniqueId() === uniqueId) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
