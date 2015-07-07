(function($){
    $.cForm = function(element, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var magicHat = this;
        
        // Access to jQuery and DOM versions of element
        magicHat.$element = $(element);
        magicHat.element = element;
        
        // Add a reverse reference to the DOM object
        magicHat.$element.data("cForm", magicHat);
        
        magicHat.init = function(){
            magicHat.options = $.extend({},$.cForm.defaultOptions, options);
            
            // Put your initialization code here
            magicHat.test();
        };
        
        // Sample Function, Uncomment to use
        magicHat.test = function(paramaters){
        	console.log('test');
        };
        
        // Run initializer
        magicHat.init();
    };
    
    $.cForm.defaultOptions = {
    };
    
    $.fn.cForm = function(options){
        return this.each(function(){
            (new $.cForm(this, options));
        });
    };
    
})(jQuery);