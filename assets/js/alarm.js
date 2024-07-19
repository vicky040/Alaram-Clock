const alarmsDetails = [];

function currentTimeSetter() {
    const now = new Date().toString();
    const timeContainer = document.getElementById('time');
    timeContainer.innerText = now.substring(16, 24);
}

setInterval(currentTimeSetter, 500);

const setAlarmButton = document.getElementById('set-alarm');
setAlarmButton.addEventListener('click', addAlarm);

function addAlarm(e) {
    e.preventDefault();
    const inputTime = document.getElementById('input-time').value;
    const inputDay = document.getElementById('input-day').value;
    var id = setAlarm(inputTime, inputDay);

    if (id === false) {
        return;
    } else {
        var alarmObj = { interval_id: id, alarm_id: inputTime, alarm_day: inputDay, snooze_count: 0 };
        alarmsDetails.push(alarmObj);

        const alarmsContainer = document.getElementById('alarms-container');

        const mainDiv = document.createElement('div');
        mainDiv.setAttribute('class', 'alarm');
        mainDiv.setAttribute('id', inputTime); // Unique ID could include inputDay as well for better uniqueness
        const timePara = document.createElement('p');
        const iconClock = document.createElement('i');
        iconClock.setAttribute('class', 'fas fa-clock');
        timePara.append(iconClock);
        timePara.append(` ${inputTime} on ${inputDay}`); // Display both time and day
        const snoozeButton = document.createElement('button');
        snoozeButton.setAttribute('data-value', inputTime);
        snoozeButton.setAttribute('class', 'snooze');
        snoozeButton.innerText = 'Snooze';
        const trashButton = document.createElement('button');
        trashButton.setAttribute('data-value', inputTime);
        trashButton.setAttribute('class', 'delete');
        const iconTrash = document.createElement('i');
        iconTrash.setAttribute('class', 'fas fa-trash');
        trashButton.append(iconTrash);
        mainDiv.append(timePara);
        mainDiv.append(snoozeButton);
        mainDiv.append(trashButton);
        alarmsContainer.prepend(mainDiv);

        snoozeButton.addEventListener('click', function () {
            snoozeAlarm(inputTime);
        });

        trashButton.addEventListener('click', function () {
            deleteAlarm(inputTime);
        });
    }
}

function deleteAlarm(inputTime) {
    var deleteElem = document.getElementById(inputTime);
    deleteElem.parentNode.removeChild(deleteElem);

    for (let i = 0; i < alarmsDetails.length; i++) {
        if (alarmsDetails[i].alarm_id == inputTime) {
            clearInterval(alarmsDetails[i].interval_id);
            alarmsDetails.splice(i, 1); 
            break; 
        }
    }
}

function ringAlarm(alarmDate, id, inputTime) {
    const now = new Date();
    
    console.log('Current time:', now);
    console.log('Alarm time:', alarmDate);

    if (alarmDate - now <= 0) {
        alert('Alarm Ringing.....Wake up!');
        clearInterval(id);
        const alarmToDelete = document.getElementById(inputTime);
        alarmToDelete.parentNode.removeChild(alarmToDelete);
        deleteAlarm(inputTime); 
    }
}

function alarmTime(time, day) {
  var today = new Date();
  var dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

  if (dayIndex === -1) {
      console.error('Invalid day:', day);
      return null; // Handle invalid input gracefully
  }

  var diff = dayIndex - today.getDay();
  if (diff <= 0) {
      diff += 7; // Move to next week if the selected day is earlier in the current week
  }

  today.setDate(today.getDate() + diff);

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  var alarmDate = new Date(`${yyyy}-${mm}-${dd} ${time}:00`);
  return alarmDate;
}


function setAlarm(inputTime, inputDay) {
  const alarmDate = alarmTime(inputTime, inputDay);
  const now = new Date();
  if (alarmDate - now >= 0) {
      console.log('Alarm set for', alarmDate);
      var id = setInterval(function () {
          ringAlarm(alarmDate, id, inputTime);
      }, 1000);
      return id;
  } else {
      alert('Alarm can\'t be set for the past time');
      return false;
  }
}


function snoozeAlarm(inputTime) {
    const snoozeInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let snoozeCount = 0;
    for (let i = 0; i < alarmsDetails.length; i++) {
        if (alarmsDetails[i].alarm_id === inputTime) {
            if (alarmsDetails[i].snooze_count < 3) {
                clearInterval(alarmsDetails[i].interval_id);
                const newAlarmTime = new Date().getTime() + snoozeInterval;
                alarmsDetails[i].interval_id = setInterval(function () {
                    ringAlarm(new Date(newAlarmTime), alarmsDetails[i].interval_id, inputTime);
                }, 1000);
                alarmsDetails[i].snooze_count++;
                console.log(`Alarm snoozed ${alarmsDetails[i].snooze_count} time(s).`);
                return;
            } else {
                alert('Maximum snooze limit reached for this alarm.');
                return;
            }
        }
    }
}
