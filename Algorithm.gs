/* Central document for creating schedule */
function createSchedule(people,slots,data,sheet){

  // Create results and scheduled rows "graveyard"
  var results = [];
  var graveyard = [];

  // Remove all availability slots that are already filled in the schedule.
  removeFilledSlots(people,slots,data,graveyard);

  while (slots.length > 0){

    // Weight Reset - set all weights to 1.
    weightReset(slots);

    // Weight Balance - prioritize people with fewer scheduled shifts.
    weightBalance(people,slots);

    // Weight Contiguous - prioritize people to stay in the tent more time at once.
    weightContiguous(people,slots,data,graveyard);

    // Weight Tough Time - prioritize time slots with few people available.
    weightToughTime(people,slots,data.length);

    // Weight Preference (Max | Ideal Day Hours) - limit max contiguous hours for an individual.
    weightPreferenceMaxIdealDayHours(people,slots,data);

    // Weight Preference (Best Day) - slight weight bump for favorite day.
    weightPreferenceBestDay(people,slots);

    // Sort by Weights
    slots.sort(function(a, b){
      return b.weight - a.weight;
    });

    // Update people, spreadsheet, and remove slots.
    weightPick(people,slots,results,graveyard,sheet,data);

  }

  // Update Spreadsheet with all results.
  SpreadsheetApp.flush();

  return results;

}

/* Remove Slots that are already useless */
function removeFilledSlots(people,slots,data,graveyard){

  // Set up graveyard.
  for (var i = 0; i < data.length; i++){
    graveyard.push(0);
  }

  // Set up counterArray.
  var counterArray = [];
  for(var i = 0; i < data.length+1; i++){
    counterArray.push(0);
  }

  // Count number of scheduled tenters during a slot.
  for(var i = SLOTS_START_ROW; i < data.length; i++){
    for(var j = PEOPLE_START_COLUMN; j <= PEOPLE_END_COLUMN; j++){
      if(data[i][j].toString().indexOf(TENT_TERM) > -1){
        counterArray[i] = counterArray[i] + 1;
      }
    }
  }

  // Iterate through every slot.
  for(var i = 0; i < slots.length; i++) {

    // Determine how many people are needed.
    var currentRow = Number(slots[i].row, 10);
    var currentCol = Number(slots[i].col, 10);

    var isNight = slots[i].time.toString().indexOf(NIGHT_TERM) > -1;
    var peopleNeeded = calculatePeopleNeeded(isNight, slots[i].phase.toString());
    var tentCounter = counterArray[currentRow];

    // Delete slot if necessary.
    if(tentCounter >= peopleNeeded){
      slots.splice(i,1);
      i--;

      if(isNight){
        people[currentCol].nightFree--;
      } else {
        people[currentCol].dayFree--;
      }
      graveyard[currentRow]=1;
    }

  }

}
