/**
* Get Trello board title
*/

function getTrelloBoardTitle() {
	var result = document.getElementsByClassName('board-header-btn-text')[0].innerHTML;
	return result;
};

/**
* Get Trello card title
*/

function getTrelloCardTitle() {
	var result = document.getElementsByClassName('card-detail-title-assist')[0].innerHTML;
	return result;
};

/**
* Get Trello card URL
*/

function getTrelloCardURL() {
	var result = window.location.href;
	return result;
};

/**
* Get Trello card due date
*/

function getTrelloCardDueDate() {
	var result = document.getElementsByClassName('card-detail-due-date-text')[0].innerHTML;
	return result;
};


/* Create Event Listener for messages from popup.js */
chrome.runtime.onMessage.addListener(

	/* Listen to request, sender and generate relevant response. */
  	function(request, sender, sendResponse) {

		/* Check for appropriate message */
    	if (request.message == "gettrellodetails") {

			/* Set variables for response message */
    		var this_board_title = getTrelloBoardTitle();
    		var this_card_title = getTrelloCardTitle();
    		var this_card_url = getTrelloCardURL();
    		var this_card_date = getTrelloCardDueDate();

			/* Send response to popup.js */
      		sendResponse({
  				success: "true",
  				board_title: this_board_title,
  				card_title: this_card_title,
  				card_url: this_card_url,
  				card_date: this_card_date
      		});
	  	};
  	}
);
