/* Global Variables */

// Data
var SLOT_EXAMPLE = {"date":0,"time":0,"phase":0,"person":0,
                    "weight":0,"row":0,"col":0};

var PERSON_EXAMPLE = {"name": 0,"dayFree": 0,"nightFree": 0,"dayScheduled": 0,
                      "nightScheduled": 0,"maxDayHours":0, "idealDayHours":0,"bestDay":0};

// Data Parameters
var SLOTS_START_ROW = 1;
var SLOTS_INFORMATION_COLUMN = 0;

var PEOPLE_START_COLUMN = 1;
var PEOPLE_END_COLUMN = 12;
var PEOPLE_NAME_ROW = 0;
var NUM_PEOPLE = 12;

var STATUS_START_ROW = 1;
var STATUS_INFORMATION_COLUMN = 13;

// Availability
var AVAILABLE_TERM = "X";
var NIGHT_TERM = "Night";
var TENT_TERM = "Tent";
var GRACE_TERM = "Grace";

// Phase Terms
var WHITE_TERM = "White";
var BLUE_TERM = "Blue";
var BLACK_TERM = "Black";

// Phase Requirements
var WHITE_DAY_PEOPLE = 1;
var BLUE_DAY_PEOPLE = 1;
var BLACK_DAY_PEOPLE = 2;

var WHITE_NIGHT_PEOPLE = 2;
var BLUE_NIGHT_PEOPLE = 6;
var BLACK_NIGHT_PEOPLE = 10;

// Month Terms
var JAN_TERM = "Jan";
var FEB_TERM = "Feb";
var MAR_TERM = "Mar";

// Time Terms
var MON = "Mon";
var TUE = "Tue";
var WED = "Wed";
var THU = "Thu";
var FRI = "Fri";
var SAT = "Sat";
var SUN = "Sun";

var MORNING_START = "07:00AM";
var WEEKEND_NIGHT_START = "02:30AM";
var WEEKDAY_NIGHT_START = "01:00AM";

//Preferences
var MAX_DAY_HOURS_ROW = 1;
var AVERAGE_NIGHT_VALUE_ROW = 2;
var IDEAL_DAY_HOURS_ROW = 3;
var BEST_DAY_ROW = 4;

var AVERAGE_NIGHT_VALUE = 0;

//Schedule Sheet
var SCHEDULE_SHEET_NAME = "Master Schedule";
