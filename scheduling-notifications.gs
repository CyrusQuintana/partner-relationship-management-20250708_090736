function initSchedulingNotifications() {
  // Ensure necessary triggers are set up without creating duplicates
  const allTriggers = ScriptApp.getProjectTriggers();
  const isTriggerSet = allTriggers.some(trigger => trigger.getHandlerFunction() === 'processScheduledMeetings');
  if (!isTriggerSet) {
    ScriptApp.newTrigger('processScheduledMeetings')
      .timeBased()
      .everyMinutes(10)
      .create();
  }
}

function scheduleMeetingInNotifications(partnerId, datetime) {
  const calendar = CalendarApp.getDefaultCalendar();
  const event = calendar.createEvent('Meeting with Partner ' + partnerId, new Date(datetime), new Date(new Date(datetime).getTime() + 60 * 60 * 1000));
  const meetingId = event.getId();

  // Store meeting details for reminders
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  sheet.appendRow([meetingId, partnerId, datetime]);

  return meetingId;
}

function sendReminderEmailInNotifications(meetingId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === meetingId) {
      const partnerId = data[i][1];
      const datetime = new Date(data[i][2]);
      const currentTime = new Date();

      // Ensure both times are in the same timezone (UTC)
      const oneHourBefore = new Date(datetime.getTime() - 60 * 60 * 1000);

      if (currentTime >= oneHourBefore && currentTime < datetime) {
        const userId = getUserEmailByPartnerId(partnerId);
        if (userId) {
          notifyUserInNotifications('REMINDER', userId);
        }
      }
      break;
    }
  }
}

function notifyUserInNotifications(eventType, userId) {
  const subject = eventType === 'REMINDER' ? 'Upcoming Meeting Reminder' : 'Notification';
  const message = eventType === 'REMINDER' ? 'This is a reminder for your upcoming meeting.' : 'You have a new notification.';

  MailApp.sendEmail(userId, subject, message);
}

function cancelMeetingInNotifications(meetingId) {
  const calendar = CalendarApp.getDefaultCalendar();
  const event = calendar.getEventById(meetingId);

  if (event) {
    event.deleteEvent();
  }

  // Remove meeting from the sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === meetingId) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function processScheduledMeetings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const meetingId = data[i][0];
    sendReminderEmailInNotifications(meetingId);
  }
}

function getUserEmailByPartnerId(partnerId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Partners');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === partnerId) {
      return data[i][1]; // Assuming the second column contains the user's email
    }
  }

  Logger.log('User email not found for partner ID: ' + partnerId);
  return null;
}