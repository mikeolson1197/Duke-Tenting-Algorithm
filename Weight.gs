/* Weight Reset - set all weights to 1. */
function weightReset(slots){
  for(var i = 0; i < slots.length; i++) {
    slots[i].weight = 1.0;
  }
}

/* Weight Balance - prioritize people with fewer scheduled shifts */
function weightBalance(people, slots){

  for(var i = 0; i < slots.length; i++) {

    // Establish variables.
    var currentPersonID = Number(slots[i].person,10);
    var dayScheduled = people[currentPersonID].dayScheduled;
    var nightScheduled = people[currentPersonID].nightScheduled;
    var currentTime = slots[i].time;

    var nightMulti = 0;
    var dayMulti = 0;

    // Set multipliers.
    if(nightScheduled != 0){
      nightMulti = 1.0/nightScheduled;
    } else {
      nightMulti = 1.5;
    }

    if(dayScheduled != 0){
      dayMulti = (1.0/(dayScheduled+nightScheduled*AVERAGE_NIGHT_VALUE*2)); ///////
    } else {
      dayMulti = 1.5;
    }

    // Adjust weights with multipliers.
    if(currentTime.toString().indexOf(NIGHT_TERM) > -1){
      slots[i].weight = slots[i].weight * nightMulti;
    } else {
      slots[i].weight = slots[i].weight * dayMulti;
    }

  }
}

/* Weight Contiguous - prioritize people to stay in the tent more time at once. */
function weightContiguous(people,slots,data,graveyard){

  for(var i = 0; i < slots.length; i++){

    // Establish Variables
    var currentRow = Number(slots[i].row, 10);
    var currentCol = Number(slots[i].col, 10);
    var currentTime = slots[i].time.toString();
    var currentDate = slots[i].date.toString();

    var aboveRow = 0;
    var belowRow = 0;
    var aboveCol = currentCol;
    var belowCol = currentCol;

    var currentIsNight = false;
    var aboveIsNight = false;
    var belowIsNight = false;

    var aboveTent = false;
    var belowTent = false;
    var aboveFree = false;
    var belowFree = false;

    var multi = 1;

    // Determine Above Row, Below Row, and Nights
    if(currentTime.indexOf(NIGHT_TERM) > -1){
      aboveRow = currentRow-1;
      belowRow = currentRow+3;
      currentIsNight = true;
    } else if (currentTime.indexOf(MORNING_START) > -1){
      aboveRow = currentRow-3;
      belowRow = currentRow+1;
      aboveIsNight = true;
    } else if (currentTime.indexOf(WEEKEND_NIGHT_START) > -1){
      aboveRow = currentRow-1;
      belowRow = currentRow+1;
      belowIsNight = true;
    } else if(currentTime.indexOf(WEEKDAY_NIGHT_START) > -1 && (currentDate.indexOf(SUN) > -1 || currentDate.indexOf(MON) > -1 || currentDate.indexOf(TUE) > -1 || currentDate.indexOf(WED) > -1 ||currentDate.indexOf(THU) > -1)){
      aboveRow = currentRow-1;
      belowRow = currentRow+1;
      belowIsNight = true;
    } else {
      aboveRow = currentRow-1;
      belowRow = currentRow+1;
    }

    // Determine tent, available, and not available for above
    if(data[aboveRow][aboveCol].toString().indexOf(TENT_TERM) > -1){
      aboveTent = true;
    } else if(data[aboveRow][aboveCol].toString().indexOf(AVAILABLE_TERM) > -1) {
      if(graveyard[aboveRow] == 1){
        aboveFree = false;
      } else {
        aboveFree = true;
      }
    }

    // Determine tent, available, and not available for below
    if(data[belowRow][belowCol].toString().indexOf(TENT_TERM) > -1){
      belowTent = true;
    } else if(data[belowRow][belowCol].toString().indexOf(AVAILABLE_TERM) > -1) {
      if(graveyard[belowRow]== 1){
        belowFree = false;
      } else {
        belowFree = true;
      }
    }

    // Both are scheduled.
    if(aboveTent && belowTent) {
      multi = 100;
    }

    // Both are not free
    if(!belowTent && !belowFree && !aboveTent && !aboveFree){
     if(slots[i].weight > 0){
       multi = -1;
     }
    }

    // Above is scheduled, below is free.
    if(aboveTent && !belowTent && belowFree){
      multi = 3.25;
    }

    // Below is scheduled, above is free.
    if(belowTent && !aboveTent && aboveFree){
      multi = 3.25;
    }

    // Above is scheduled, below is not free.
    if(aboveTent && !belowTent && !belowFree){
      multi = 3;
    }

    // Below is scheduled, above is not free.
    if(belowTent && !aboveTent && !aboveFree){
      multi = 3;
    }

    // Both are free
    if(belowFree && aboveFree){
      multi = 2.75;
    }

    // Above is free, below is not free
    if(aboveFree && !belowTent && !belowFree){
      multi = 1;
    }

    // Below is free, above is not free
    if(belowFree && !aboveTent && !aboveFree){
      multi = 1;
    }

    // Night Multi
    if(aboveIsNight || belowIsNight || currentIsNight) {
      multi = multi*1.25;
    }

    slots[i].weight = slots[i].weight*multi;

  }
}

/* Weight Tough Time - prioritize time slots with few people available. */
function weightToughTime(people,slots,length){

  // Set up counterArray.
  var counterArray = [];
  for(var i = 0; i < length+1; i++){
    counterArray.push(0);
  }

  // Fill counterArray.
  for(var i = 0; i < slots.length; i++){
    var currentRow = Number(slots[i].row, 10);
    counterArray[currentRow] = counterArray[currentRow] + 1.0 ;
  }

  // Update Weights.
  for(var i = 0; i < slots.length; i++){
    var currentRow = Number(slots[i].row, 10);
    var currentTime = slots[i].time;
    var isNight = currentTime.toString().indexOf(NIGHT_TERM) > -1
    var peopleNeeded = calculatePeopleNeeded(isNight,slots[i].phase.toString());
    var numFreePeople = counterArray[currentRow];
    slots[i].weight = slots[i].weight*(NUM_PEOPLE/numFreePeople)*peopleNeeded;
  }

}

/* Weight Preference (Max Day Hours) - limit max contiguous hours for an individual */
function weightPreferenceMaxIdealDayHours(people,slots,data) {

  for(var i = 0; i < slots.length; i++){

    // Establish Variables
    var currentRow = Number(slots[i].row, 10);
    var currentCol = Number(slots[i].col, 10);
    var currentTime = slots[i].time.toString();

    var aboveRow = 0;
    var belowRow = 0;

    // Determine Above Row, Below Row, and Nights
    if(currentTime.indexOf(NIGHT_TERM) > -1){
      aboveRow = currentRow-1;
      belowRow = currentRow+3;
    } else if (currentTime.indexOf(MORNING_START) > -1){
      aboveRow = currentRow-3;
      belowRow = currentRow+1;
    } else {
      aboveRow = currentRow-1;
      belowRow = currentRow+1;
    }

    var aboveCounter = 0;
    var belowCounter = 0;

    var currentAboveValue = data[aboveRow][currentCol];
    var currentAbovePhase = data[aboveRow][SLOTS_INFORMATION_COLUMN];
    var currentBelowValue = data[belowRow][currentCol];
    var currentBelowPhase = data[belowRow][SLOTS_INFORMATION_COLUMN];

    // Count contiguous above tent shifts.
    while(currentAboveValue.toString().indexOf(TENT_TERM) > -1){

      if(currentAbovePhase.toString().indexOf(NIGHT_TERM) > -1){
        aboveCounter = aboveCounter + AVERAGE_NIGHT_VALUE/2;
        aboveRow = aboveRow - 1;
      } else {
        aboveCounter++;
        if(currentAbovePhase.toString().indexOf(MORNING_START) > -1){
          aboveRow = aboveRow - 3;
        } else {
          aboveRow = aboveRow - 1;
        }
      }

      currentAboveValue = data[aboveRow][currentCol];
      currentAbovePhase = data[aboveRow][SLOTS_INFORMATION_COLUMN];
    }

    // Count contiguous below tent shifts.
    while(currentBelowValue.toString().indexOf(TENT_TERM) > -1){

      if(currentBelowPhase.toString().indexOf(NIGHT_TERM) > -1){
        belowCounter = belowCounter + AVERAGE_NIGHT_VALUE/2;
        belowRow = belowRow + 3;
      } else {
        belowCounter++;
        belowRow++;
      }

      currentBelowValue = data[belowRow][currentCol];
      currentBelowPhase = data[belowRow][SLOTS_INFORMATION_COLUMN];
    }

    // Update Weights
    var currentMaxDayHours = Number(people[currentCol].maxDayHours,10);
    var currentIdealDayHours = Number(people[currentCol].idealDayHours,10);

    // Ideal
    if(currentIdealDayHours*2 <= belowCounter+aboveCounter){
      slots[i].weight = slots[i].weight*(currentIdealDayHours*2.0)/((belowCounter+aboveCounter)*3);
    }

    // Max
    if(currentMaxDayHours*2 <= belowCounter+aboveCounter) {
      if(belowCounter > 0 && aboveCounter > 0) {
      } else {
        if(slots[i].weight > 0){
          slots[i].weight = slots[i].weight*-1;
        }
      }
    }
  }
}

/* Weight Preference (Best Day) - slight weight bump for favorite day.  */
function weightPreferenceBestDay(people,slots){

  for(var i = 0; i < slots.length; i++){

    var currentCol = Number(slots[i].col,10);
    var currentDate = (slots[i].date).toString();
    var bestDay = (people[currentCol].bestDay).toString();

    if(currentDate.indexOf(bestDay) > -1) {
      slots[i].weight = slots[i].weight * 1.1;
    }

  }

}

/* Update people, spreadsheet, and remove slots. */
function weightPick(people,slots,results, graveyard, sheet, data){

  // Remove winner from list.
  var winner = slots.splice(0,1);
  results.push(winner[0]);

  // Update person information.
  var currentPersonID = Number(winner[0].person,10);
  var currentTime = winner[0].time;

  if(currentTime.toString().indexOf(NIGHT_TERM) > -1){
    people[currentPersonID].nightScheduled++;
    people[currentPersonID].nightFree--;
  } else {
    people[currentPersonID].dayScheduled++;
    people[currentPersonID].dayFree--;
  }

  // Update Spreadsheet
  var row = Number(winner[0].row,10);
  var col = Number(winner[0].col,10);

  if( results.length % 20 == 0) {
    SpreadsheetApp.flush();
  }

  data[row][col] = TENT_TERM;
  sheet.getRange(row+1,col+1).setValue(TENT_TERM);

  // SpreadsheetApp.flush();

  //sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET_NAME);
  //data = sheet.getDataRange().getValues();

  // Establish Variables
  var currentPhase = winner[0].phase;
  var currentRow = Number(winner[0].row, 10);
  var currentCol = Number(winner[0].col, 10);
  var tentCounter = 0;

  // Count number of scheduled tenters during winner slot.
  for(var j = PEOPLE_START_COLUMN; j <= PEOPLE_END_COLUMN; j++){
    if(data[currentRow][j].toString().indexOf(TENT_TERM) > -1){
      tentCounter++;
    }
  }

  // Determine how many people are needed.
  var isNight = currentTime.toString().indexOf(NIGHT_TERM) > -1;
  var peopleNeeded = calculatePeopleNeeded(isNight, currentPhase.toString());

  // Update Slots and Graveyard
  if(tentCounter >= peopleNeeded){
    graveyard[currentRow] = 1;
    for(var i = 0 ; i < slots.length; i++){
      var tempRow = Number(slots[i].row, 10);
      var tempCol = Number(slots[i].col, 10);
      if(tempRow == currentRow) {
        if(isNight){
          people[tempCol].nightFree--;
        } else {
          people[tempCol].dayFree--;
        }
        slots.splice(i,1);
        i--;
      }
    }
  }
}
