var currentStatus = 'Off';

var serverUrl = '';
language = 'en';

var lastUpdate = 0;

var powerImages = {};
powerImages['On'] ='images/exit.png';
powerImages['Off'] ='images/on.png';
powerImages['TurningOn'] ='images/on-rotate.gif';
powerImages['TurningOff'] ='images/exit-rotate.gif';

function openFoobar() {
	if (currentStatus == 'On') {
		window.open('http://192.168.0.210:8888/ajquery/index.html', '_blank');
	}
}

function showStatus(status) {
	// For debugging
	if (status == '{{eg.globals.yamaha}}') {
		status = currentStatus;
		currentStatus = currentStatus.indexOf('Off') == -1 ? 'On' : 'Off';
	}
	else {
		currentStatus = status;
	}
	$( "img" ).each(function( index ) {
		for (var key in powerImages) {
			if (this.src.indexOf(powerImages[key]) != -1) {
				if (key == status) {
					$(this).show();
					$(this).parent().blur();
				}
				else {
					$(this).hide();
				}
			}			
		}
	});
	$( "button" ).each(function( index ) {
		if (this.attributes['data-action'] && this.attributes['data-action'].nodeValue != 'power.toggle') {
			this.disabled = (status != 'On');
		}
	});
}


$(document).ready(function() {
						   
    $("*[data-action]").bind('touchend', function() {
        return true;
    });
    $("*[data-action]").bind('click', function() {
        var action = $(this).attr("data-action");
        var element = $(this);
        element.blur();
        
        $.ajax({
            url: serverUrl+'/ajax.html?'+action,
            cache: false,
            success: [function(element) {
                if (element.attr("href")) {
                    setTimeout(function() {
                        window.location=element.attr("href");
                    }, 500);
                }
                return true;
            }(element), function(status) {
            	showStatus(status);
                element.blur();
            }]
        });
       
    });
    
    $('input[type="range"]').change({
        lastUpdate: lastUpdate
    }, function(event) {
        var ts = (new Date()).getTime();
        if (event.data.lastUpdate+200 < ts) {
            event.data.lastUpdate = ts;
            value = $(this).val();
            $.ajax({
                url: serverUrl+'/ajax.html?'+$(this).attr('id')+'.'+value,
                dataType: 'JSONP',
                cache: false
            });
        }
    });
    
});