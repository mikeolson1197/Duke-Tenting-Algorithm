/* Find number of people needed in the tent */
function calculatePeopleNeeded(isNight, phase) {
  if(phase.indexOf(BLACK_TERM) > -1){
    if(isNight){
      return BLACK_NIGHT_PEOPLE;
    }else{
      return BLACK_DAY_PEOPLE;
    }
  }
  if(phase.indexOf(BLUE_TERM) > -1){
    if(isNight){
      return BLUE_NIGHT_PEOPLE;
    }else{
      return BLUE_DAY_PEOPLE;
    }
  }
  if(phase.indexOf(WHITE_TERM) > -1){
    if(isNight){
      return WHITE_NIGHT_PEOPLE;
    }else{
      return WHITE_DAY_PEOPLE;
    }
  }
}
