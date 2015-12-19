/*!
 * jQuery cForms v1.2.6
 * http://cforms.jacksbox.de
 *
 * Author: Mario Jäckle
 * eMail: support@jacksbox.de
 *
 * Copyright 2015, jacksbox.design
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($){
    $.cForm = function(element, options){
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$element = $(element);
        base.element = element;
        
        // Add a reverse reference to the DOM object
        base.$element.data("cForm", base);
        
        base.init = function(){
            base.options = $.extend({},$.cForm.defaultOptions, base.options);
           	base.options.templates = $.extend({},$.cForm.defaultOptions.templates, base.options.templates);

            // elements which will be styled
            var filter = ['input', 'textarea', 'select', 'button'];

            // initialize an array for radio groups
        	base.radioGroupArray = [];

            // check if the called element a wrapper or a form-element
            // invoce the corresponding functions
            if(base.$element.is(filter.join())){
            	var tag = base.tagName(base.$element);

            	if(tag === 'input') 	base.identifyInputType(base.$element);
            	if(tag === 'select') 	base.handleSelect(base.$element);
            	if(tag === 'button') 	base.handleButton(base.$element);
            	if(tag === 'textarea') 	base.handleTextarea(base.$element);
            } else {        		
            	base.$element.find('input').each(function(){
            		base.identifyInputType($(this));
            	});
            	base.$element.find('select').each(function(){
            		base.handleSelect($(this));
            	});
            	base.$element.find('button').each(function(){
            		base.handleButton($(this));
            	});
            	base.$element.find('textarea').each(function(){
            		base.handleTextarea($(this));
            	});
            }
        };

        // identify input type
        

        base.identifyInputType = function($node){
        	var type = $node.attr('type');

        	// you better having a type, son!
            if (typeof type === typeof undefined && type === false) {
				console.log('Error: Missing type-Attribute on input!');
				return false;
			}

			switch(type) {
			    case 'password':
			    case 'text':
            		base.handleInputText($node, type);
			        break;
			    case 'file':
            		base.handleInputFile($node);
			        break;
			    case 'checkbox':
			    	base.handleInputCheckbox($node);
			    	break;
			    case 'radio':
			    	base.handleInputRadio($node);
			    	break;
			    case 'submit':
			    	base.handleInputSubmit($node);
			        break;
			    default:
					console.log('Error: No matching was found - You will be forever alone!');
			};
        };

        // easy stuff first

		/**
		 * handles the BUTTON conversion
		 * 
		 * @param  {object} $node jQuery-Element // BUTTON
		 */
        base.handleButton = function($node) {
        	var template = base.options.templates['button'];
        	$node.wrap(template);
        };

		/**
		 * handles the BUTTON conversion
		 * 
		 * @param  {object} $node jQuery-Element // BUTTON
		 */
        base.handleInputSubmit = function($node) {
        	var template = base.options.templates['submit'];
        	$node.wrap(template);
        };

		/**
		 * handles the INPUT/TEXT conversion
		 * 
		 * @param  {object} $node jQuery-Element // INPUT/TEXT
		 */
        base.handleInputText = function($node, type) {
        	var template = base.options.templates[type];
        	$node.wrap(template);
        };

		/**
		 * handles the TEXTAREA conversion
		 * 
		 * @param  {object} $node jQuery-Element // TEXTAREA
		 */
        base.handleTextarea = function($node) {
        	var template = base.options.templates['textarea'];
        	$node.wrap(template);
        };

        // helper for the more complex stuff
        
        base.inputData = function($node) {
        	this.name = $node.attr('name');
        	this.value = $node.attr('value');
        	this.checked = $node.attr('checked');
        	this.template = base.options.templates[$node.attr('type')];
        	this.$html = $();

			if (typeof this.name === typeof undefined && this.name === false) {
				this.name = '';
			}
			if (typeof this.value === typeof undefined && this.value === false) {
				this.value = '';
			}
			if (typeof this.checked === typeof undefined && this.checked === false) {
				this.checked = '';
			}

        	return this;
        };

        /**
		 * handles the INPUT/FILE conversion
		 * 
		 * @param  {object} $node jQuery-Element // INPUT/FILE
		 */
        base.handleInputFile = function($node) {
        	var data = base.inputData($node);

			data.$html = $(data.template.replace('{{name}}',data.name));
	
			// when the cForm file button gets clicked
			// trigger the original file button
			data.$html.bind('click', 
				{
					$node: $node
				},
				function (event) {
					var $node = event.data.$node;
						$node.trigger('click');
				}
			);

			// when the original file input gets changed (gets a file)
			// update the cForm file input as well
			$node.bind(
				'change', 
				{
					$html: data.$html
				},
				function (event) {
					var filename = $(this).val().split('\\').pop(),
						$html = event.data.$html;
				
					$html.addClass('filled')
						.find('.cform-filename')
							.text(filename);
				}
			);
			
			base.addToDom($node, data.$html);
        };

        /**
		 * handles the INPUT/CHECKBOX conversion
		 * 
		 * @param  {object} $node jQuery-Element // INPUT/CHECKBOX
		 */
        base.handleInputCheckbox = function($node) {
        	var data = base.inputData($node);

			data.$html = $(data.template.replace('{{name}}',data.name).replace('{{value}}',data.value));

			if(data.checked || data.checked === 'checked'){
				data.$html.addClass('checked')
					.data('checked', true);
			}

			// when the cForm checkbox gets clicked, change its style/values
			// change the original checkbox as well
			data.$html.bind(
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

			// when the original checkbox gets changed via js or other means
			// update the cForm checkbox as well
			$node.bind(
				'change', 
				{
					$mirror: data.$html
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
			
			base.addToDom($node, data.$html);
        };

        /**
		 * handles the INPUT/RADIO conversion
		 * 
		 * @param  {object} $node jQuery-Element // INPUT/RADIO
		 */
        base.handleInputRadio = function($node) {
        	var data = base.inputData($node);

			// for each radio group (= same name) we want do this just once!
			if(base.radioGroupArray.indexOf(data.name) > -1){
				return false;
			}
			base.radioGroupArray.push(data.name);

			var $mirrors = $();

			// get all radios with the same name and iterate
			// create html and insert, also hide the original
			$nodes = base.$element.find('input[type="radio"][name="' + data.name + '"]');
			$nodes.each(function(){
				var $node = $(this),
					value = $node.val(),
					checked = $node.attr('checked'),
					$html = $();

				$html = $(data.template.replace('{{name}}', data.name).replace('{{value}}', value));

				checked && $html.addClass('checked').data('checked', 'true');
	
				$mirrors = $mirrors.add($html);
				$node.addClass('cform-hidden').after($html);
			});

			// when a cForm radio gets clicked, change its style/values
			// change the original radio as well
			$mirrors.bind(
				'click', 
				{
					$mirrors: $mirrors, 
					$origins: $nodes
				}, 
				function(event){
					var $node = $(this),
						$mirrors = event.data.$mirrors,
						$origins = event.data.$origins,
						value = $node.data('value');
			
					if($node.data('checked')) return true;
			
					$mirrors.removeClass('checked')
						.data('checked', false);
					$node.addClass('checked')
						.data('checked', true);
					$origins.prop('checked', true)
						.filter('[value="' + value + '"]')
						.prop('checked', true);
				}
			);

			  // when the original radio group gets changed via js or other means
			  // update the cForm radio group as well
			$nodes.bind(
				'change', 
				{
					$mirrors: $mirrors, 
					$origins: $nodes
				}, 
				function(event){
					var $node = $(this),
						$mirrors = event.data.$mirrors,
						$origins = event.data.$origins,
						value = $node.val();

					if($node.data('checked')) return true;

					$mirrors.removeClass('checked')
						.data('checked', false)
						.filter('[data-value="' + value + '"]')
							.data('checked', true)
							.addClass('checked');
				}
			);
			
			base.addToDom($node, data.$html);
        };

       	/**
		 * handles the SELECT conversion
		 * 
		 * @param  {object} $node jQuery-Element // SELECT
		 */
        base.handleSelect = function($node){
        	var data = base.inputData($node);
        		data.multiple = $node.attr('multiple'),
        		data.$subnodes = $node.find('option'),
        		data.$selected = data.$subnodes.filter(':selected'),
        		data.optionsHtml = '',
        		data.$options = $(),
        		data.cssclass = "";


			if($node.hasClass("disabled") || $node.is('[disabled=disabled]')){
				data.cssclass = "disabled";
				$node.addClass("disabled");
			}
			if (typeof data.multiple === typeof undefined || data.multiple === false) {
				data.multiple = false;
				data.template = base.options.templates['select'];
				data.$html = $(data.template.replace('{{name}}', data.name)
							.replace('{{text}}', data.$selected.html())
							.replace('{{class}}', data.cssclass));
			}else{
				data.multiple = true;
				data.template = base.options.templates['multiselect'];
				data.$html = $(data.template.replace('{{name}}', data.name)
							.replace('{{class}}', data.cssclass));
			}

			// create and populate the option list
			data.$subnodes.each(function(index){
				var $node = $(this),
					cssclass = $node.prop('selected')?'selected':'',
					template = base.options.templates['option'];

				template = template.replace('{{value}}', $node.val())
								.replace('{{text}}', $node.html())
								.replace('{{class}}', cssclass);

				data.optionsHtml += template;
			});
			data.$options = $(data.optionsHtml).filter('li');

			// hide/show options
			data.$html.find('.cform-control').bind(
				'click',
				{
					$origin:  $node, 
					$mirror: data.$html
				}, 
				function(event){
					var $origin = event.data.$origin,
						$mirror = event.data.$mirror;

					if( $origin.hasClass('disabled') ||  $origin.is('[disabled=disabled]')){
						// don't handle the click
						return false;
					}
					$mirror.addClass('active');

					$(document).bind(
						'click.cForm',
						{
							$mirror: $mirror
						},
						function(event) {
							$mirror = event.data.$mirror;

					  		if (!$(event.target).closest('.cform-select').length) {
								$mirror.removeClass('active');
					  		  	$(document).unbind('click.cForm');
					  	}
					});
			});

			// when a cForm select-option gets clicked, change its style/values
			// change the original select/option as well
			data.$options.bind(
				'click', 
				{
					$origin:  $node, 
					$mirror:  data.$html, 
					$options: data.$options,
					multiple: data.multiple
				},
				function (event) {
					var $node = $(this),
						$origin = event.data.$origin,
						$mirror = event.data.$mirror,
						$options = event.data.$options,
						multiple = event.data.multiple,
						value = $node.data('value'),
						text = $node.html();

					if( $node.hasClass('disabled') ||  $node.is('[disabled=disabled]')){
						// don't handle the click
						return;
					}
						
					if(!multiple){
						$options.not($node).removeClass('selected');
						$node.addClass('selected');
		
						$origin.val(value);

						$mirror.data('value', value)
							.removeClass('active')
							.find('.cform-control .text')
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

					$origin.trigger('cFormChanged');
				}
			);

			// when the original select gets changed via js or other means
			// update the cForm select/options as well
			$node.bind(
				'change', 
				{
					$origin:  $node,
					$mirror:  data.$html,  
					$options: data.$options,
					multiple: data.multiple
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
							.find('.cform-control .text')
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
								.addClass('selected');
						}
					}
				}
			);

			// when the original select gets changed via js or other means
			// update the cForm select/options as well
			$node.bind(
				'updateAttributes',
				{
					$origin:  $node,
					$mirror:  data.$html,
					$options: data.$options,
					multiple: data.multiple
				},
				function(event){
					var $node = $(this),
						value = $node.val(),
						text = $node.find('option[value="' + value + '"]').html(),
						$origin = event.data.$origin,
						$mirror = event.data.$mirror,
						$options = event.data.$options,
						multiple = event.data.multiple;

					var $originOptions = $origin.find('option');
					var $mirrorOptions = $mirror.find('li');
					$options.each(function(index){
						var $dataAttributes = $originOptions.eq(index).data();
						$mirrorOptions.eq(index).data($dataAttributes);

						var $disabled = $originOptions.eq(index).prop('disabled');
						if ($disabled) {
							$mirrorOptions.eq(index).addClass('disabled');
						} else {
							$mirrorOptions.eq(index).removeClass('disabled');
						}
					});
				}
			);


			// adds the option-list-html to the cForm element
			data.$html.find('ul').append(data.$options);

			base.addToDom($node, data.$html);
        };

        /**
         * adds an jQuery-Element to the DOM 
         * and hides the connected element
         * 
         * @param {object} $node jQuery-Element (original)
         * @param {object} $html Query-Element (cForm)
         */
        base.addToDom = function($node, $html) {
			$node.addClass('cform-hidden').after($html);
        };

        /* *** HELPER *** */

		/**
		 * return the tag name of an html-tag (in lower-case)
		 * 
		 * @param  {string} $element html-tag as string
		 * @return {string}          name of the html-tag
		 */
        base.tagName = function($element) {
  			return $element.prop("tagName").toLowerCase();
		};
        
        /* *** RUN THE PLUGIN *** */

        base.init();
    };
    
    $.cForm.defaultOptions = {
    	templates:		{	// html templates for the differnet form fields
    		text:      		'<div class="cform-text"></div>',
    		textarea:      	'<div class="cform-text"></div>',
    		password:   	'<div class="cform-text cform-password"></div>',
    		file:   		'<div class="cform-file" data-name="{{name}}">\
    							<div class="cform-control">choose file</div>\
    							<div class="cform-filename"> click here</div>\
    						</div>',
    		checkbox:		'<div class="cform-checkbox" data-name="{{name}}" data-value="{{value}}">\
    							<div class="cform-marker"></div>\
    						</div>',
    		radio:			'<div class="cform-radio" data-name="{{name}}" data-value="{{value}}">\
    							<div class="cform-marker"></div>\
    						</div>',
    		select: 		'<div class="cform-select {{class}}" data-name="{{name}}">\
    							<div class="cform-control"><span class="text">{{text}}</span><span class="chevron bottom"></span></div>\
    							<ul></ul>\
    						</div>',
    		multiselect: '<div class="cform-multiselect" data-name="{{name}}">\
    							<ul></ul>\
    						</div>',
    		option: 		'<li data-value="{{value}}" class="{{class}}">{{text}}</li>',
    		button: 		'<div class="cform-button"></div>',
    		submit: 		'<div class="cform-submit"></div>',
    	}
    };
    
    $.fn.cForm = function(options){
        return this.each(function(){
            (new $.cForm(this, options));
        });
    };
    
})(jQuery);