
(function(window, document){
    var fn = {
        Init: function(){
            alert("Test");
        },
        Create: {

        },
        Event: {
            Success:  function() {
                window.top.postMessage("success", '*');
            }
        }
    };
    
    fn.Init();
})(window, document);