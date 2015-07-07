(function($){
    $.cForm = function(element, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$element = $(element);
        base.element = element;
        
        // Add a reverse reference to the DOM object
        base.$element.data("cForm", base);
        
        base.init = function(){
            base.options = $.extend({},$.cForm.defaultOptions, options);

            var filter = ['input', 'textarea', 'select', 'button'];

            // Put your initialization code here
            // INIT
            if(base.$element.is(filter.join())){
            	var tag = base.tagName(base.$element);

            	if(tag === 'input') base.convertInput(base.$element);
            }
        };
        
        // converts inout fields
        base.convertInput = function(node){
        	var type = node.attr('type'),
        		name = node.attr('name'),
        		value = node.attr('value'),
        		template = '',
        		$html = $();

            if (typeof type === typeof undefined && type === false) {
				console.log('Error: Missing type-Attribute on input!');
				return false;
			}
			if (typeof name === typeof undefined && name === false) {
				name = '';
			}
			if (typeof value === typeof undefined && value === false) {
				value = '';
			}


			switch(type) {
			    case 'password':
			    case 'text':
			        break;
			    case 'checkbox':
			        break;
			    case 'radio':
			        break;
			    case 'submit':
			        break;
			    default:
					console.log('Error: No matching type was found - You will be forever alone!');
			}
			
        };

        base.tagName = function($element) {
  			return $element.prop("tagName").toLowerCase();
		};
        
        // Run initializer
        base.init();
    };
    
    $.cForm.defaultOptions = {
    };
    
    $.fn.cForm = function(options){
        return this.each(function(){
            (new $.cForm(this, options));
        });
    };
    
})(jQuery);