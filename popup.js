/**
* Check whether the URL in the browser window is a Trello Card
*/



function renderStatus(text)
{
    document.getElementById('status').innerHTML = text;
}

/**
* Create new tab with new calendar event in it, populated with Title, Description, Start Date/Time and End Date/Time
*/

function newCalendarTab(title, description, start, end)
{
  var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

  url += '&text=' +  title;
  url += '&dates=' +  start + '/' + end;
  url += '&details=' +  description;
  url = encodeURI(url);

  chrome.tabs.create({'url': url}, function(tab) {
    /* Tab opened */
  });

}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


/* Create Event Listener once DOM Content Loaded */
document.addEventListener('DOMContentLoaded', function() {

  /* update status */
  renderStatus('Popup initiated');

  /* target current window */
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

              /* Create listener for new calendar event button */
        document.getElementById("new_calendar_event").addEventListener("click", function(){

          /* Set variables for new calendar event based on calendar form */
          var title = document.getElementById('calendar_title').value;
          var description = document.getElementById('calendar_description').value;

          var dueDate = document.getElementById("card_date").textContent
          var startTime = moment(dueDate,'MMM D [at] h:mm A').toISOString();

          /* Create new tab with new calendar event */
          console.log(newCalendarTab(title, description, startTime, startTime));

        });

        /* update status */
        renderStatus('Sending request to page');

        /* Select current tab */
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

          /* Send message to  content.js in current tab */
          chrome.tabs.sendMessage(tabs[0].id, {message: "gettrellodetails"}, function(response) {
              /* ON RESPONSE */


              /* update status */
              renderStatus('Response received');

              /* update Trello Details based on response from content.js */
              document.getElementById('board_title').innerHTML = response.board_title;
              document.getElementById('card_title').innerHTML = response.card_title;
              document.getElementById('card_url').innerHTML = response.card_url;
              document.getElementById('card_date').innerHTML = response.card_date;

              /* update status */
              renderStatus('Processing response');

              /* update Calendar Details based on response from content.js */
              document.getElementById('calendar_title').value = decodeHtml(response.card_title + " [" + response.board_title + "]");
              document.getElementById('calendar_description').value = response.card_url;
             // document.getElementById('calendar_start').value = response.card_date;
             // document.getElementById('calendar_end').value = response.card_date;

              renderStatus('Response processed');

          });
        });


  });

});