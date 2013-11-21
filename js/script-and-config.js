var serverUrl = '';
language = 'en';

var lastUpdate = 0;

$(document).ready(function() {
						   
    $("*[data-action]").bind('touchend', function() {
        return true;
    });
    $("*[data-action]").bind('click', function() {
        var action = $(this).attr("data-action");
        var href = $(this).attr("href");
        var element = $(this);
        
        $.ajax({
            url: serverUrl+'/ajax.html?'+action,
            cache: false,
            success: function(element) {
                if (element.attr("href")) {
                    setTimeout(function() {
                        window.location=element.attr("href");
                    }, 500);
                }
                return true;
            }(element)
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