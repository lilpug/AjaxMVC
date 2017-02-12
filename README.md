# AjaxMVC

AjaxMVC is a plugin that allows easy dynamic ajax calls to be made which automatically hook up to aspnet core MVC 5+ and pass antiforgerytokens.

## Getting Started
Download and include Jquery

Download and include the minified js file under the dist folder and your ready to start making requests with the plugin.


## Normal Ajax function

To make a normal ajax request do the following:-
```javascript
<script>	
	var postData = {
		example1: "example",
		example2: "example"
	};
		
	var done = function(data)
	{
		alert("This is after the request has finished");
	};
	
	//The main function
	$("#form").AjaxFormDataMVC(postData, "post", "json", "/testing/url", done, true, true);  
	
	//parameters: (data, type, dataType, url, doneCallback, checkFormValidity, showProcessingModal)
</script>
```

Parameter Information:-
* **The Selector:** this is the form element which you are submitting **$("#the form element your submitting here")**
* **data:** the data you will be sending in the request
* **type:** A "GET or POST" type
* **dataType:** the data format you want the data returned in, if you specify json as a dataType, the plugin automatically converts the output into a json object for returning to the callback function
* **url:** The url you will be making the request to
* **doneCallback:** a function which will be run on the return of the request, this will also be passed the data retrieved if any
* **checkFormValidatity:** Whether or not you would like us to fire the html5 validation and ensure its all correct before we continue the request
* **showProcessingModal:** Whether or not you would like us show a bootstrap processing modal if its taking more than 4 seconds

## Fileupload Ajax function

there are two different fileupload ajax calls, one which has an automatic bootstrap modal showing the fileupload progression and one that allows
a callback for the progress to be managed externally.

### Bootstrap Modal Fileupload

To make a fileupload ajax request that has the automatic bootstrap modal do the following:-
```javascript
<script>	
	var postData = {
		example1: "example",
		example2: "example",
		file: $('#files')[0].files
	};
		
	var done = function(data)
	{
		alert("This is after the request has finished");
	};
	
	//The main function
	$("#form").AjaxMVCFileUploadBlock(postData, "post", "json", "/testing/url", done, true);  
	
	//parameters: (data, type, dataType, url, doneCallback, checkFormValidity)
</script>
```

Parameter Information:-
* **The Selector:** this is the form element which you are submitting **$("#the form element your submitting here")**
* **data:** the data you will be sending in the request
* **type:** A "GET or POST" type
* **dataType:** the data format you want the data returned in, if you specify json as a dataType, the plugin automatically converts the output into a json object for returning to the callback function
* **url:** The url you will be making the request to
* **doneCallback:** a function which will be run on the return of the request, this will also be passed the data retrieved if any
* **checkFormValidatity:** Whether or not you would like us to fire the html5 validation and ensure its all correct before we continue the request


### Fileupload Without The Modal

To make a fileupload ajax request that has the automatic bootstrap modal do the following:-
```javascript
<script>	
	var postData = {
		example1: "example",
		example2: "example",
		file: $('#files')[0].files
	};
		
	var done = function(data)
	{
		alert("This is after the request has finished");
	};
	
	var progression = function(e)
	{
		alert("This gets called throughout the fileupload process and can be linked to progress bars etc");
	};
	
	//The main function
	$("#form").AjaxMVCFileUploadBlock(postData, "post", "json", "/testing/url", done, true, progression);  
	
	//parameters: (data, type, dataType, url, doneCallback, checkFormValidity, progressCallback)
</script>
```

Parameter Information:-
* **The Selector:** this is the form element which you are submitting **$("#the form element your submitting here")**
* **data:** the data you will be sending in the request
* **type:** A "GET or POST" type
* **dataType:** the data format you want the data returned in, if you specify json as a dataType, the plugin automatically converts the output into a json object for returning to the callback function
* **url:** The url you will be making the request to
* **doneCallback:** a function which will be run on the return of the request, this will also be passed the data retrieved if any
* **checkFormValidatity:** Whether or not you would like us to fire the html5 validation and ensure its all correct before we continue the request
* **progressCallback:** a function which will be run throughout the file upload process and can update progress bars etc

## Copyright and License
Copyright &copy; David Whitehead

You do not have to do anything special by using the MIT license and you don't have to notify anyone that your using this license. You are free to use, modify and distribute this software in normal and commercial usage as long as the copyright header is left intact (specifically the comment block which starts with /*!).