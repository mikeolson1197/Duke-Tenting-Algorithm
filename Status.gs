/* Update status after scheduling */
function setStatus(data){

  var currentDate;
  var currentPhase;
  var currentTime;

  for( var i = STATUS_START_ROW; i < data.length; i++){

    // Collect and update information about each time.
    var currentRowHead = data[i][SLOTS_INFORMATION_COLUMN];

    // Update Date
    if(currentRowHead.toString().indexOf(JAN_TERM) > -1 || currentRowHead.toString().indexOf(FEB_TERM) > -1 || currentRowHead.toString().indexOf(MAR_TERM) > -1) {
      currentDate = currentRowHead;
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET_NAME).getRange(i+1,STATUS_INFORMATION_COLUMN+1).setValue(currentDate);

      // Update Phase / General Status
    } else if(currentRowHead.toString().indexOf(WHITE_TERM) > -1 || currentRowHead.toString().indexOf(BLUE_TERM) > -1 || currentRowHead.toString().indexOf(BLACK_TERM) > -1) {
      currentPhase = currentRowHead;
      var length;

      if(currentDate.toString().indexOf(FRI) >-1 || currentDate.toString().indexOf(SAT) > -1){
        length = 39;
      } else {
        length = 36;
      }

      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET_NAME).getRange(i+1,STATUS_INFORMATION_COLUMN+1)
      .setFormula('=if(COUNTIF(N'+(i+2)+':N'+(i+2+length)+',"Missing People")>=1,"INCOMPLETE","Complete")');

      // Update Status
    } else {
      currentTime = currentRowHead;
      var isNight = currentTime.toString().indexOf(NIGHT_TERM) > -1;
      var peopleNeeded = calculatePeopleNeeded(isNight, currentPhase.toString());
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET_NAME).getRange(i+1,STATUS_INFORMATION_COLUMN+1)
      .setFormula('=if(OR(COUNTIF(B'+(i+1)+':M'+(i+1)+',"'+TENT_TERM+'")>='+peopleNeeded+',COUNTIF(B'+(i+1)+':M'+(i+1)+',"'+GRACE_TERM+'")>=1),"Tent Filled", "Missing People")');
    }
  }
}
