/* Establish map of all tenters with data */
function createPeople(data,preferencesData) {

  var map = {};

  // Iterate through each person.
  for (var i = PEOPLE_START_COLUMN; i <= PEOPLE_END_COLUMN; i++) {

    // Create current person.
    var currentPerson = {"name": data[PEOPLE_NAME_ROW][i],
                         "dayFree": 0,
                         "nightFree": 0,
                         "dayScheduled": 0,
                         "nightScheduled": 0,
                         "maxDayHours":0,
                         "idealDayHours":0,
                         "bestDay":0
                        };

    // Fill in current peron preferences.
    currentPerson.maxDayHours = preferencesData[MAX_DAY_HOURS_ROW][i];
    currentPerson.idealDayHours = preferencesData[IDEAL_DAY_HOURS_ROW][i];
    currentPerson.bestDay = preferencesData[BEST_DAY_ROW][i]

    // Fill in current person free and scheduled information.
    for (var j = 0; j < data.length; j++) {

      var isNight = data[j][SLOTS_INFORMATION_COLUMN].toString().indexOf(NIGHT_TERM) > -1;
      var currentCell = data[j][i];

      if(currentCell.toString().indexOf(AVAILABLE_TERM) > -1){
        if(isNight){
          currentPerson.nightFree++;
        } else{
          currentPerson.dayFree++;
        }
      }

      if(currentCell.toString().indexOf(TENT_TERM) > -1) {
        if(isNight){
          currentPerson.nightScheduled++;
        }else{
          currentPerson.dayScheduled++;
        }
      }

    }

    // Push to map.
    map[i] = currentPerson;

  }

  return map;

}

/* Establish array of all timeslots */
function createSlots(data) {

  var results = [];
  var currentPhase;
  var currentDate;
  var currentTime;

  // Iterate through each time.
  for(var i = SLOTS_START_ROW; i < data.length; i++){

    // Collect and update information about each time.
    var currentRowHead = data[i][SLOTS_INFORMATION_COLUMN];
    if(currentRowHead.toString().indexOf(WHITE_TERM) > -1 || currentRowHead.toString().indexOf(BLUE_TERM) > -1 || currentRowHead.toString().indexOf(BLACK_TERM) > -1) {
      currentPhase = currentRowHead;
    } else if(currentRowHead.toString().indexOf(JAN_TERM) > -1 || currentRowHead.toString().indexOf(FEB_TERM) > -1 || currentRowHead.toString().indexOf(MAR_TERM) > -1) {
      currentDate = currentRowHead;
    } else {
      currentTime = currentRowHead;
    }

    // Iterate through each person for a given time.
    for(var j = PEOPLE_START_COLUMN; j <= PEOPLE_END_COLUMN; j++){

      var currentCell = data[i][j];

      // If a person is available, add a slot in to the array.
      if(currentCell.toString().indexOf(AVAILABLE_TERM) > -1) {
        var slot = {"date":currentDate,
                    "time":currentTime,
                    "phase":currentPhase,
                    "person":j,
                    "weight":1.0,
                    "row":i,
                    "col":j
                   };

        results.push(slot);

      }
    }
  }

  return results;

}

function setAverageNightPreference(preferencesData) {
  return Number(preferencesData[AVERAGE_NIGHT_VALUE_ROW][PEOPLE_END_COLUMN+1],10);
}
