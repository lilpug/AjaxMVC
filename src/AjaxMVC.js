/*!
    Title: AjaxMVC
    URL: https://github.com/lilpug/ajaxmvc
    Version: 1.1
    Author: David Whitehead
    Copyright (c) David Whitehead
    Copyright license: MIT
    Description: A plugin which sits on top of the ajax requests so we have a standard way of passing requests to aspnet 5+ mvc
                 with the anti forgery tokens etc.             
	Requires: jquery, bootstrap 3.3+
*/
(function ($)
{
    /*-------------------------------------------------*/
    /*           The MVC Validation Functions          */
    /*-------------------------------------------------*/

    //This function gets the asp verification token and merges it into the data object supplied
    function MVCAddValidation(theForm, data)
    {
        //Gets the anti forgery token
        var token = $(theForm).find('[name=__RequestVerificationToken]').val();

        //Checks there is a validation token to extend
        if (token != undefined && token != "")
        {
            if (data != undefined && data != null)
			{
				//Merges the forgery token into the paramters
				$.extend(data, { __RequestVerificationToken: token });
			}
			else
			{
				//Creates the new post data with the token if no post data has been sent
				data = { __RequestVerificationToken: token };
			}
        }

        return data;
    }


    /*-------------------------------------------------*/
    /*        The Form Data Conversion Function        */
    /*-------------------------------------------------*/
    
    //This function converts a data object into a formData object
    function FormDataConvert(data)
    {
        //Creates the formData object
        var formData = new FormData();

        //Loops over the passed data object and converts the keys and values into the formData format
        $.each(data, function (key, value)
        {
            //If its a basic type then just append it otherwise loop over adding it            
            if(value == null || typeof value === "string" || typeof value ==="boolean" || typeof value === "number")
            {
                formData.append(key, value);
            }
            else
            {   
                //Note: this section is general used for arrays or filelist etc
                $.each(value, function (key2, value2)
                {
                    //Note:We only need the value so we use the key supplied at the start
                    formData.append(key, value2);
                });
            }
        });

        //Returns the converted object
        return formData;
    }
    

    /*-------------------------------------------------*/
    /*           The Bootstrap Modal Function          */
    /*-------------------------------------------------*/

    //This function attaches the show and hide modal events to the ajax request
    function AttachModalDisplay(html, modalID, startDelay, stopDelay) {
        //Stores the show blockui function for cancelling later
        var startFunction = null;

        //Blocks the input while we ajax
        $(document).ajaxStart(function () 
		{	
			//Adds the modal to the body
			//Note: we do it here as in some cases like the fileupload progress ajax methods, the modal is not created when trying to add values if done in the start function.
			$("body").append(html);
			
            //Sets the blockui to show after a second of ajax start if not finished before
            startFunction = setTimeout(function () 
			{	
                //Adds some styling
                $(modalID).attr("style", "z-index: 20000000;")
                $(modalID).modal("show");
            }
            , startDelay)
        }).ajaxStop(function () {
            //Clears the start timer
            clearTimeout(startFunction);

            //Unblocks if its blocked
            setTimeout(function () {
                //Removes the element once its hidden and unlinks the request
                $(document).on("hidden.bs.modal", modalID, function () {
                    //Unlinks the hide event
                    $(document).off("hidden.bs.modal", modalID);

                    //Removes the html
                    $(modalID + "-container").remove();
                });

                $(modalID).modal("hide");
            }
            , stopDelay);

            //Unbinds the ajax events attached
            $(document).unbind('ajaxStart');
            $(document).unbind('ajaxStop');
        });
    }

    //This function generates the default processing bootstrap modal html
    function GetInProgressModal()
    {
        return '<div id="ajax-processing-modal-container"><style>#ajax-processing-modal-container .modal-footer { border-top: none !important; } #ajax-processing-modal-container .modal { display: block !important; }  #ajax-processing-modal-container .modal-title h3{margin-top:5px;}#ajax-processing-modal-container .modal-title i{font-size:20px;}/* Extra Small Devices, Phones */ @media only screen and (max-width : 320px){#ajax-processing-modal-container .modal-body .notice{text-align: left !important;}}#ajax-processing-modal-container .modal-body .notice{padding-top:5px !important;}#ajax-processing-modal-container .modal-content{-webkit-border-radius: 0; -webkit-background-clip: padding-box; -moz-border-radius: 0; -moz-background-clip: padding; border-radius: 6px; background-clip: padding-box; -webkit-box-shadow: 0 0 40px rgba(0,0,0,.5); -moz-box-shadow: 0 0 40px rgba(0,0,0,.5); box-shadow: 0 0 40px rgba(0,0,0,.5); color: #000; background-color: #fff; border: rgba(0,0,0,0);}#ajax-processing-modal-container .modal-message .modal-header{margin-bottom: 10px; padding: 15px 0 8px; text-align: center!important;}#ajax-processing-modal-container .modal-message .modal-body, #ajax-processing-modal-container .modal-message .modal-footer, #ajax-processing-modal-container .modal-message .modal-title{padding: 0 20px; text-align: center!important;}#ajax-processing-modal-container .modal-message .modal-title{color: #737373; margin-bottom: 3px;}#ajax-processing-modal-container .modal-message .modal-body{color: #737373;}#ajax-processing-modal-container .modal-message .modal-header .fa, #ajax-processing-modal-container .modal-message .modal-header .glyphicon, .modal-message .modal-header .typcn, #ajax-processing-modal-container .modal-message .modal-header .wi{font-size: 30px;}#ajax-processing-modal-container .modal-body p{margin-top:5px;}#ajax-processing-modal-container .modal-message .modal-footer{margin-bottom:20px;}#ajax-processing-modal-container .modal-message.modal-info .modal-header{color: #57b5e3; border-bottom: 3px solid #57b5e3;}</style> <div id="ajax-processing-modal" class="modal modal-message modal-info fade" aria-hidden="true" data-backdrop="static" data-keyboard="false"> <div class="modal-dialog modal-md"> <div class="modal-content"> <div class="modal-header"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i> </div><div class="modal-title"> <i class="fa fa-spin fa-spinner" aria-hidden="true"></i> <h3>Processing</h3> </div><div class="modal-body"> <p class="notice"><b>Processing your request please wait</b></p></div><div class="modal-footer"> </div></div></div></div></div>';
    }

    //This function generates the default fileupload bootstrap modal html
    function GetFileuploadProgressModal() {
        return '<div id="ajax-fileupload-modal-container"> <style>#ajax-fileupload-modal-container .modal-footer { border-top: none !important; } #ajax-fileupload-modal-container .modal-title h3{margin-top:5px;}#ajax-fileupload-modal-container .modal-title i{font-size:20px;}#ajax-fileupload-modal-container .status-info .left{text-align:left;}#ajax-fileupload-modal-container .status-info p{display:inline !important;}#ajax-fileupload-modal-container .status-info .right{text-align:right;}/* Small Devices, Tablets */ @media only screen and (max-width : 768px){#ajax-fileupload-modal-container .status-info .right{text-align:left !important;}}/* Extra Small Devices, Phones */ @media only screen and (max-width : 480px){#ajax-fileupload-modal-container .modal-body .notice{text-align: left !important;}}#ajax-fileupload-modal-container .progress-bar{background-image: none!important; background-color: #6CF06C !important;}#ajax-fileupload-modal-cancel{margin-bottom:15px; margin-top:10px; outline: none;}#ajax-fileupload-modal-container .modal-body .notice{padding-top:5px !important;}#ajax-fileupload-modal-container .modal-content{-webkit-border-radius: 0; -webkit-background-clip: padding-box; -moz-border-radius: 0; -moz-background-clip: padding; border-radius: 6px; background-clip: padding-box; -webkit-box-shadow: 0 0 40px rgba(0,0,0,.5); -moz-box-shadow: 0 0 40px rgba(0,0,0,.5); box-shadow: 0 0 40px rgba(0,0,0,.5); color: #000; background-color: #fff; border: rgba(0,0,0,0);}#ajax-fileupload-modal-container .modal-message .modal-header{margin-bottom: 10px; padding: 15px 0 8px; text-align: center!important;}#ajax-fileupload-modal-container .modal-message .modal-body, #ajax-fileupload-modal-container .modal-message .modal-footer, #ajax-fileupload-modal-container .modal-message .modal-title{padding: 0 20px; text-align: center!important;}#ajax-fileupload-modal-container .modal-message .modal-title{color: #737373; margin-bottom: 3px;}#ajax-fileupload-modal-container .modal-message .modal-body{color: #737373;}#ajax-fileupload-modal-container .modal-message .modal-header .fa, #ajax-fileupload-modal-container .modal-message .modal-header .glyphicon, .modal-message .modal-header .typcn, #ajax-fileupload-modal-container .modal-message .modal-header .wi{font-size: 30px;}#ajax-fileupload-modal-container .modal-body .progress, #ajax-fileupload-modal-container .modal-body p{margin-top:5px;}#ajax-fileupload-modal-container .modal-message .modal-footer{margin-bottom:20px;}#ajax-fileupload-modal-container .modal-message.modal-info .modal-header{color: #57b5e3; border-bottom: 3px solid #57b5e3;}</style> <div id="ajax-fileupload-modal" class="modal modal-message modal-info fade" style="display: block;" aria-hidden="true" data-backdrop="static" data-keyboard="false"> <div class="modal-dialog modal-md"> <div class="modal-content"> <div class="modal-header"> <i class="fa fa-file" aria-hidden="true"></i> </div><div class="modal-title"> <i class="fa fa-spin fa-spinner" aria-hidden="true"></i> <h3>Uploading Content</h3> </div><div class="modal-body"> <p class="notice"><b>Your content is uploading please wait until its completed</b></p><div class="row status-info"> <div class="col-sm-6 right"> <p></p>Total Size: </p><p class="total-size"></p></div><div class="col-sm-6 left"> <p>Currently At: </p><p class="currently-at"></p></div></div><div class="row"> <div class="col-sm-10 col-sm-offset-1"> <div class="progress"> <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" style="width: 0%"> <span class="sr-only">0%</span> </div></div></div></div><button id="ajax-fileupload-modal-cancel" class="btn btn-danger">Cancel The Upload</button> </div><div class="modal-footer"> </div></div></div></div></div>';
    }


    /*-------------------------------------------------*/
    /*     The HTML 5 Form Validation Functions        */
    /*-------------------------------------------------*/

    //This function fires off the html5 validitity if the browser supports it, if everything is valid it returns true
    //Note: it also returns true for browser that do not allow html5 validation to be fired, thus we should also do server side checking.
    function FormValidityCheck(theForm) {
        if ((hasFormValidation() && theForm[0].checkValidity()) || !hasFormValidation()) {
            return true;
        }
        return false;
    }

    /* used to check if form.checkValidity can be used */
    function hasFormValidation() {
        return (typeof document.createElement('input').checkValidity == 'function');
    };

    
    /*-------------------------------------------------*/
    /*             The Ajax Functions                  */
    /*-------------------------------------------------*/

    //NOTE: All the ajax methods below all use formData to upload the content which is why we do not need to specifiy the format we are sending it in
    
    //The fileupload ajax methods
    //Note: these methods do not return promises as it would break the ajax progression if we did

    $.fn.AjaxMVCFileUploadBlock = function (data, type, dataType, url, doneCallback, checkFormValidity)
    {
        //If checkFormValidity is set to true then we also check the forms html5 validation before submitting the post request
        if (checkFormValidity == undefined || (checkFormValidity == true && FormValidityCheck(this)) || checkFormValidity == false)
        {   
            //attachs the modal popup to the ajax requests
            AttachModalDisplay(GetFileuploadProgressModal(), "#ajax-fileupload-modal", 1000, 1);
            
            //Adds the mvc validation token
            data = MVCAddValidation(this.selector, data);

            var request =  $.ajax({
                type: type,
                url: url,
                timeout: 1000 * 60 * 60 * 24, //24 hour timeout
                
                /* deals with attaching a function to update the progress information */
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload)
                    {
                        myXhr.upload.addEventListener('progress', function (e)
                        {
                            //This function is used to convert the bytes supplied into their correct format for user output
                            function bytesToSize(bytes)
                            {
                                if (bytes == 0) return '0 Byte';
                                var k = 1024;
                                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                                var i = Math.floor(Math.log(bytes) / Math.log(k));
                                return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
                            }

                            //Checks the length is computable and the blockui dialog box exists
                            if (e.lengthComputable && $("#file-upload-dialog-box"))
                            {
                                var max = e.total;
                                var current = e.loaded;

                                $("#ajax-fileupload-modal-container .total-size").text(bytesToSize(max));
                                $("#ajax-fileupload-modal-container .currently-at").text(bytesToSize(current));
								
                                var Percentage = (current * 100) / max;
                                if (Percentage >= 100)
                                {
                                    $('#ajax-fileupload-modal-container .progress-bar').css('width', 100 + '%');                                    
                                    $('#ajax-fileupload-modal-container .progress-bar').html(100 + '%');
                                }
                                else
                                {
                                    $('#ajax-fileupload-modal-container .progress-bar').css('width', Percentage + '%');                                    
                                    $('#ajax-fileupload-modal-container .progress-bar').html(Math.round(Percentage) + '%');
                                }
                            }
                        }, false);
                    }
                    return myXhr;
                },               

                contentType: false,
                processData: false,
                dataType: dataType,

                //Checks if the passed data is just an object or formData, if its an object then its converted to formData
                data: (data.append != null) ? data : FormDataConvert(data)
            })
            .fail(function(e)
            {
                //When aborting or failing this is where it hits                
            })
            .done(function (data)
            {
                if (dataType == "json")
                {
                    //Converts the returned output into a json object
                    var jsonObject = $.parseJSON(data);

                    //Calls the finished callback supplied with the results returned
                    doneCallback(jsonObject);
                }
                else {
                    //Calls the finished callback supplied with the results returned
                    doneCallback(data);
                }
            });

            //Links the cancellation button to aborting the ajax call
            $(document).on("click", "#ajax-fileupload-modal-cancel", function ()
            {
                //Adds the cancelling styling
                $("#ajax-fileupload-modal-container .modal-message .modal-header").attr("style", "color: #d73d32 !important; border-bottom: 3px solid #e46f61 !important;");
                $("#ajax-fileupload-modal-container .modal-body, #ajax-fileupload-modal-container .modal-title").attr("style", "color: #d73d32 !important");
                $("#ajax-fileupload-modal-container .modal-title h3").text("Stopping The Uploading");
                $("#ajax-fileupload-modal-container .modal-body .notice").text("Stopping your content upload please wait");

                //Cancells the ajax
                request.abort();

                //Unlinks the click button as we have now cancelled it
                $(document).off("click", "#ajax-fileupload-modal-cancel");                
            });
        }
    };
    
    $.fn.AjaxMVCFileUpload = function (data, type, dataType, url, doneCallback, checkFormValidity, progressCallback)
    {
        //If checkFormValidity is set to true then we also check the forms html5 validation before submitting the post request
        if (checkFormValidity == undefined || (checkFormValidity == true && FormValidityCheck(this)) || checkFormValidity == false)
        {
            //Adds the mvc validation token
            data = MVCAddValidation(this.selector, data);

            var request = $.ajax({
                type: type,
                url: url,
                timeout: 1000 * 60 * 60 * 24, //24 hour timeout

                /* deals with attaching a function to update the progress information */
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', progressCallback(e), false);
                    }
                    return myXhr;
                },

                contentType: false,
                processData: false,
                dataType: dataType,

                //Checks if the passed data is just an object or formData, if its an object then its converted to formData
                data: (data.append != null) ? data : FormDataConvert(data)
            })
            .fail(function (e) {
                //When aborting or failing this is where it hits                
            })
            .done(function (data)
            {
                if (dataType == "json")
                {
                    //Converts the returned output into a json object
                    var jsonObject = $.parseJSON(data);

                    //Calls the finished callback supplied with the results returned
                    doneCallback(jsonObject);
                }
                else
                {
                    //Calls the finished callback supplied with the results returned
                    doneCallback(data);
                }
            });
        }
    };
    

    //The general ajax method

    $.fn.AjaxFormDataMVC = function (data, type, dataType, url, doneCallback, checkFormValidity, showProcessingModal)
    {
        //If checkFormValidity is set to true then we also check the forms html5 validation before submitting the post request
        if (checkFormValidity == undefined || (checkFormValidity == true && FormValidityCheck(this)) || checkFormValidity == false)
        {
            //Only add block input if the flag was enabled
            if (showProcessingModal != null && showProcessingModal == true)
            {
                //attachs the modal popup to the ajax requests
                AttachModalDisplay(GetInProgressModal(), "#ajax-processing-modal", 1000, 1);
            }

            //Adds the mvc validation token
            data = MVCAddValidation(this.selector, data);

            //Returns the promise object
            return $.ajax({
                type: type,
                url: url,

                contentType: false,
                processData: false,

                dataType: dataType,
                data: (data.append != null) ? data : FormDataConvert(data)
            })
            .done(function (data)
            {
                if (dataType == "json")
                {
                    //Converts the returned output into a json object
                    var jsonObject = $.parseJSON(data);

                    //Calls the finished callback supplied with the results returned
                    doneCallback(jsonObject);
                }
                else
                {
                    //Calls the finished callback supplied with the results returned
                    doneCallback(data);
                }
            });
        }
    };
}(jQuery));