# jquery.cForm
jQuery cForm replaces your in many cases unstylable form-elements (input, select, radio, checkbox, file, button, textarea) with nice and clean non-form html code which can be styled via CSS.
The original elements are retained (just hidden), so you won´t loose any form-element related functionality. 
You can add custom HTML templates for all supported form elements and use CSS to style them. Or you just use the default templates and style them with the included CSS or SCSS file.

####[Demo](http://cform.jacksbox.de)

### Feedback

Please give me feedback to make cForm better: Either as github-issue, or to [support@jacksbox.de](support@jacksbox.de)

## Usage

**1. Include script**

Add jquery.cform.js or jquery.cform.min.js in your html file

**2. Include styles**

Add cform.style.css or cform.style.min.css in your html file
This will add basic styling for the generated elements.

**3. Call cForm**

Call cForm inside of your $(document).ready() function.
You can either call it on elements which contain multiple form-elements 
(which will than work on every of this element) or on a form-element directly 
(which will just style this element).

`$('.element').cForm();`

**4. Enjoy!**

### Plugin options

```js
$('.element').cForm({
  templates: { 
    text:        'html-template',
    textarea:    'html-template',
    password:    'html-template',
    file:        'html-template',
    checkbox:    'html-template',
    radio:       'html-template',
    select:      'html-template',
    multiselect: 'html-template',
    option:      'html-template',
    button:      'html-template',
    submit:      'html-template',
  }
});
```

In case of *text*, *password* and *textarea*, the given template will just be wraped around the input.

All other templates have to include `data-name="{{name}}"` and `data-value="{{value}}"` in the outermost element.

*select* templates also have to contain the placeholder `{{text}}`, which indicates the position the current selected value will be shown.
*select* and *options* templates contain a placeholder `{{class}}`, which will add a class `selected` to the by default selected option.

(to see how the default templates look, scroll to the end of the readme file)

##Additional Information

The original form-element won´t be removed from the DOM. It will just be hidden. 
Changing the value of the cForm element (by user interaction) will also change 
the connected (and hidden) form-element.

If you want to change a form-value by JavaScript, change the value of the original 
element and use the jQuery function `.trigger('change')` on the changed element: the 
connected cForm element will than be updated automatically.

Calling `updateAttributes` on a cForm-Select field will check the original select field for changed attributes 
(e.g. disabled) and update them on the cForm-Select.

Additionaly there is a `cFormChanged` Event which will be fired when a cForm-Element was changed.

## List of default templates

```html
input type="text"
<div class="cform-text"></div>

input type="password" // password
<div class="cform-text cform-password"></div>

textarea // textarea
<div class="cform-text"></div>

input type="file" // file
<div class="cform-file" data-name="{{name}}">
  <div class="cform-control">choose file</div>
  <div class="cform-filename"> click here</div>
</div>

input type="checkbox" // checkbox
<div class="cform-checkbox" data-name="{{name}}" data-value="{{value}}">
  <div class="cform-marker"></div>
</div>

input type="radio" // radio
<div class="cform-radio" data-name="{{name}}" data-value="{{value}}">
  <div class="cform-marker"></div>
</div>

select // select
<div class="cform-select {{class}}" data-name="{{name}}">
  <div class="cform-control">{{text}}</div>
  <ul></ul>
</div>

select multiple // multiselect
<div class="cform-multiselect {{class}}" data-name="{{name}}">
  <ul></ul>
</div>

select option // option
<li data-value="{{value}}" class="{{class}}">{{text}}</li>

button // button
<div class="cform-button"></div>

input type="submit" // submit
<div class="cform-submit"></div>
```
