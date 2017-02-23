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

          // holding place until date algorithm is sorted.
          var today = new Date();

          // set start date as +1 hour from now [rounded up]
          // end date as +2 hours rom now [rounded up]
          var start = today.getFullYear();

          start += ("0" + (today.getMonth() + 1)).slice(-2);
          start += ("0" + (today.getDate() + 1)).slice(-2);
          start += "T";

          var end = start;

          start += ("0" + (today.getHours() + 2)).slice(-2);
          start += "0000";
          start += "Z";

          end += ("0" + (today.getHours() + 3)).slice(-2);
          end += "0000";
          end += "Z";

          /* Create new tab with new calendar event */
          newCalendarTab(title, description, start, end);

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
//              document.getElementById('calendar_start').value = response.card_date;
//              document.getElementById('calendar_end').value = response.card_date;

              renderStatus('Response processed');

          });
        });


  });

});