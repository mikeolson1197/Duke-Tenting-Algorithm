/* Interface */
function onOpen() {

  // Google Sheets Button
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Scheduler').addItem('Schedule Shifts', 'driver').addToUi();

}

/* Main Driver */
function driver() {

  // Page Initialization
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE_SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var preferencesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Preferences");
  var preferencesData = preferencesSheet.getDataRange().getValues();

  // Setup
  var people = createPeople(data,preferencesData);
  var slots = createSlots(data);
  AVERAGE_NIGHT_VALUE = setAverageNightPreference(preferencesData);

  // Algorithm
  var schedule = createSchedule(people,slots,data,sheet);

  // Update Status
  setStatus(data);

}

// SpreadsheetApp.getUi().alert();
