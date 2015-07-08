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

            	if(tag === 'input') base.handleInput(base.$element);
            	if(tag === 'select') base.handleSelect(base.$element);
            }
        };
        
        // converts input fields
        base.handleInput = function($node){
        	var type = $node.attr('type'),
        		name = $node.attr('name'),
        		value = $node.attr('value'),
        		checked = $node.attr('checked'),
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
			if (typeof checked === typeof undefined && checked === false) {
				checked = '';
			}

			template = $.cForm.defaultOptions.templates[type];

			switch(type) {
			    case 'password':
			    case 'text':
			    	$node.wrap(template);
			        break;
			    case 'checkbox':
			    	$html = $(template.replace('{{name}}',name));

			    	// checkbox checked?
			    	if(checked || checked === 'checked'){
			    		$html.addClass('checked')
			    			.data('checked', true);
			    	}

			    	// bind the click behaviour
			    	$html.bind(
			    		'click', 
			    		{
			    			$origin: $node
			    		},
			    		function(event){
			    			var $node = $(this),
			    				$origin = event.data.$origin,
			    				checked = $node.data('checked');
	
			    			if(checked){
			    				$origin.prop('checked', false);
			    				$node.removeClass('checked')
			    					.data('checked', false);
			    			}else{
			    				$origin.prop('checked', true);
			    				$node.addClass('checked')
			    					.data('checked', true);
			    			}
			    		}
			    	);

			    	// let you change the value of the checkbox via js
			    	$node.bind(
			    		'change', 
			    		{
			    			$mirror: $html
			    		}, 
			    		function(event){
			    			var $node = $(this),
			    				$mirror = event.data.$mirror;
	
			    			if($node.prop('checked')){
			    				$mirror.addClass('checked')
			    					.data('checked', true);
			    			}else{
								$mirror.removeClass('checked')
			    					.data('checked', false);
			    			}
			    		}
			    	);
			        break;
			    case 'radio':
			        break;
			    case 'submit':
			        break;
			    default:
					console.log('Error: No matching was found - You will be forever alone!');
			}
			
			base.addToDom($node, $html);
        };

        // converts select fields
        base.handleSelect = function($node){
        	var name = $node.attr('name'),
        		value = $node.attr('value'),
        		multiple = $node.attr('multiple'),
        		$subnodes = $node.find('option'),
        		$selected = $subnodes.filter(':selected'),
        		template = '',
        		$options = $(),
        		$html = $();

			if (typeof attr !== typeof undefined && attr !== false) {
			    // ...
			}
			if (typeof name === typeof undefined && name === false) {
				name = '';
			}
			if (typeof multiple === typeof undefined || multiple === false) {
				multiple = false;
				template = $.cForm.defaultOptions.templates['select'];
				$html = $(template.replace('{{name}}', name)
							.replace('{{text}}', $selected.html()));
			}else{
				multiple = true;
				template = $.cForm.defaultOptions.templates['multiselect'];
				$html = $(template.replace('{{name}}', name));
			}

			$subnodes.each(function(index){
				var $node = $(this),
					cssclass = $node.prop('selected')?'selected':'',
					template = $.cForm.defaultOptions.templates['option'];

				template = template.replace('{{value}}', $node.val())
								.replace('{{text}}', $node.html());

				$options = $options.add($(template).addClass(cssclass));
			});

			$options.bind(
				'click', 
				{
					$origin: $node, 
					$mirror: $html, 
					$options: $options,
					multiple: multiple
				},
				function (event) {
					var $node = $(this),
						$origin = event.data.$origin,
						$mirror = event.data.$mirror,
						$options = event.data.$options,
						multiple = event.data.multiple,
						value = $node.data('value'),
						text = $node.html();
						
					if(!multiple){
						$options.not($node).removeClass('selected');
						$node.addClass('selected');
		
						$origin.val(value);
		
						$mirror.data('value', value)
							.find('.cform-control')
								.html(text);							
					}else{
						var value_array = [];
						if($node.hasClass('selected')){
							value_array = $origin.val();
							value_array.splice(value_array.indexOf(value), 1);

							$origin.val(value_array);
							$mirror.data('value', value_array);
							$node.removeClass('selected');
						}else{
							value_array = $origin.val()?$origin.val():[];
							value_array.push(value);

							$origin.val(value_array);
							$mirror.data('value', value_array);
							$node.addClass('selected');
						}
					}
				}
			);

			$html.find('ul').append($options);

			$node.bind(
				'change', 
				{
					$origin: $node,
					$mirror: $html,  
					$options: $options,
					multiple: multiple
				}, 
				function(event){
					var $node = $(this),
						value = $node.val(),
						text = $node.find('option[value="' + value + '"]').html(),
						$origin = event.data.$origin,
						$mirror = event.data.$mirror,
						$options = event.data.$options,
						multiple = event.data.multiple;

					if(!multiple){
						$mirror.data('value', value)
							.find('.cform-control')
								.html(text);
		
						$options.removeClass('selected')
							.filter('[data-value="' + value + '"]')
							.addClass('selected');
					}else{
						var value_array = $origin.val()?$origin.val():[],
							i = 0;
						$mirror.data('value', value_array);

						$options.removeClass('selected');
						
						for(i = 0; i < value_array.length; i++){
							$options.filter('[data-value="' + value_array[i] + '"]')
								.addClass('selected')
						};
					}
				}
			)
			base.addToDom($node, $html);
        };

        base.addToDom = function($node, $html) {
			$node.addClass('cform-hidden').after($html);
        };

        base.tagName = function($element) {
  			return $element.prop("tagName").toLowerCase();
		};

		base.createCheckbox = function() {

		};
        
        // Run initializer
        base.init();
    };
    
    $.cForm.defaultOptions = {
    	templates:		{
    		text:      		'<div class="cform-text"></div>',
    		password:   	'<div class="cform-text cform-password"></div>',
    		checkbox:		'<div class="cform-checkbox" data-name="{{name}}">\
    							<div class="cform-marker"></div>\
    						</div>',
    		radio:			'<div class="cform-radio" data-name="{{name}}">\
    							<div class="cform-marker"></div>\
    						</div>',
    		select: 		'<div class="cform-select" data-name="{{name}}">\
    							<div class="cform-control">{{text}}</div>\
    							<ul></ul>\
    						</div>',
    		multiselect: '<div class="cform-multiselect" data-name="{{name}}">\
    							<ul></ul>\
    						</div>',
    		option: 		'<li data-value="{{value}}">{{text}}</li>',
    	}
    };
    
    $.fn.cForm = function(options){
        return this.each(function(){
            (new $.cForm(this, options));
        });
    };
    
})(jQuery);