/* Author: 

*/


$(document).ready(function() {
    
    var map = 
        {
            'testtag':'test activity',
            'tester':'test acrtivity2'
            
        }
    
    log('document ready');

    $.each(map, function(key,value) {
        $('#'+key).click(function() {log(value);});
        
    });
    


});


















