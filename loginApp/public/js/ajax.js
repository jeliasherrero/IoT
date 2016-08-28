$(document).ready(
    function doPoll() {
        $.ajax({
            type: 'GET',
            url: 'https://raspberrypi.local:8484/properties/temperature?token=cKXRTaRylYWQiF3MICaKndG4WJMcVLFz',
            headers: {Accept : "application/json"},
            success: function( data ){
                console.log(data);
                $('#sistema').html(data[0].t + ' C');
                setTimeout(doPoll, 5000);
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });
});