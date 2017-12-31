import jQuery from 'jquery';
import Handlebars from 'handlebars/dist/handlebars.js';

var LaundryStatus = window.LaundryStatus || {};

(function statusScopeWrapper($) {

	var refreshButton = $('.button.refresh')

	var statusLabels = {
		'on' : {
			message: 'In Use',
			class: 'alert'
		},
		'off' : {
			message: 'Available',
			class: 'success'
		},
		'unknown' : {
			message: 'Unknown',
			class: 'warn'
		}
	};

	/**
	 * Loads application instance configuration from file
	 **/
	function loadConfig() {
		return $.ajax({
			url: 'assets/data/config.json',
			success: function(result) {
				LaundryStatus.config = result;
			}
		});	
	}

	/**
	 * Initializes the page
	 **/
	function init() {
		$('title').text(LaundryStatus.config.locationname + ' laundry status');
		disableRefresh();
	}

	function loadTemplate() {
		return $.ajax({
			url: 'assets/templates/machines.html',
			success: function(result) {
				LaundryStatus.template = Handlebars.compile(result);
			}
		});
	}

	/**
	 * Disables the refresh button so that people don't click
	 * multiple times
	 **/
	function disableRefresh() {
		refreshButton.addClass('disabled').prop('disabled', true).text('Updating...')
	}

	/**
	 * Re-enables the refresh button
	 **/
	function enableRefresh() {
		refreshButton.removeClass('disabled').prop('disabled', false).text('Check status')
	}

	function requestStatus(location) {
		disableRefresh();

		return $.ajax({
			method: 'GET',
			url: LaundryStatus.config.gateway + '/status/' + location,
			// headers: {
			// 	"x-api-key": LaundryStatus.config.apikey
			// },
			contentType: 'application/json',
			success: completeRequest,
			error: function(jqXHR, textStatus, errorThrown) {
				console.error('Error requesting status:', textStatus, ', Details: ', errorThrown);
				console.error('Response: ', jqXHR.responseText);
			}
		});
	}

	function completeRequest(result) {

		var data = {
			updated: formatTime(result.timestamp),
			machines: LaundryStatus.config.machines.map(function(machine, index) {
				var state = 'unknown';
				// Extract the status of the machine
				var status = result.machines.find(function(el) {
					return el.id === machine.id;
				});

				state = (status.state) ? 'on' : 'off';
				if(typeof status.state === 'undefined') {
					state = 'unknown';
				}

				return {
					id: machine.id,
					name: machine.name,
					type: machine.type,
					status: state,
					label: statusLabels[state]
				}
			})
		};

		var contents = LaundryStatus.template(data);

		$('.machines').children().remove();
		$('.machines').append(contents);

		enableRefresh();
	}

	function formatTime(timestamp) {
		var date = new Date(timestamp * 1000); // JS uses ms, UNIX uses s
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var formattedTime = hours + ':' + minutes.substr(-2);

		return formattedTime;
	}

	/**
	 * Setup events
	 **/
	function events() {
		refreshButton.on('click',function() {
			requestStatus(LaundryStatus.config.locationid);
		});
	}

	// Initialize
	$(function() {
		loadConfig().done(function() {
			init();
			events();
			loadTemplate();
			requestStatus(LaundryStatus.config.locationid);
		});
	});

})(jQuery);