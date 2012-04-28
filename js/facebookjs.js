(function($){

//=================================mongohq stuff=================================//
mongoGetDocs = function (obj){
  $.ajax({
    url: 'https://api.mongohq.com/databases/Tournaments4Gamers/collections/events',
    type: 'GET',
    dataType: 'json',
    data: {
      "_apikey":"wc4gj9zp6pmmwt55zqak",
    },
    success: function(r) {
      data.arySpecials = r;
      getLocationIDs();
    },
    error: function(data) {
      console.log("Mongo: fail",data);
      return false;
    }
   });
};//mongoGetDocs

mongoCreateDocument = function(obj){
  
	$.ajax({
    url: 'https://api.mongohq.com/databases/Tournaments4Gamers/collections/events/documents',
    type: 'POST',
    dataType: 'json',
    data: {
      "_apikey":"wc4gj9zp6pmmwt55zqak",
      "document": obj
    },
    success: function(r) {
      console.log("Mongo: success",r);
    },
    error: function(data) {
      console.log("Mongo: fail",data);
    }
   });
};//mongoCreateDocument

mongoUpdateDocutment = function(obj){
	$.ajax({
		url: 'https://api.mongohq.com/databases/Tournaments4Gamers/collections/events/documents',
		type: 'PUT',
		dataType : 'json',
		data : {
			"_apikey":"wc4gj9zp6pmmwt55zqak",
      		"document": obj
		},
		success: function(r) {
      		console.log("Mongo: success",r);
    	},
    	error: function(data) {
      		console.log("Mongo: fail",data);
    	}
	});
};//mongoEditDocutment

//=================================facebook stuff=================================//
FB.init({
    		appId  : '406898225995404',
    		status : true, // check login status
    		cookie : true, // enable cookies to allow the server to access the session
    		xfbml  : true, // parse XFBML
    		oauth  : true // enable OAuth 2.0
  		});

checkLogin = function(){
	FB.getLoginStatus(function(response){
		if(response.status == 'connected'){
			$.mobile.changePage( "#homepage", "slideup" );
		}else{
			$.mobile.changePage( "#loginpage", "slideup" );
		}
	});
}//checkLogin

logout = function(){
	FB.logout(function(response) {
 		$.mobile.changePage( "#loginpage", "slideup" );
	});
};//logout

init = function(){
	FB.getLoginStatus(function(response){
		if(response.status == 'connected'){
			$.mobile.changePage("#homepage","slideup");
		}else{
			$.mobile.changePage( "#loginpage", "slideup" );
		};
	});
};//init

login = function(){
	FB.api('/me', function(response) {
		checkLogin();
		$.mobile.changePage( "#homepage", "slideup" );
	});
};//login

createEvents = function(title,userDesc,people,utcStart,utcEnd, location){
	console.log(utcStart);
	console.log(utcEnd);
	
	FB.api('/me/events','post',{name:title,start_time:utcStart,end_time:utcEnd,location:location,description:userDesc},function(resp) {
    	if(resp == true)
    	{
    		var newId = resp.id;
			FB.api('/' + newId + '/invited?users='+people, 'post', function(response){
				if(response == true){
					$.mobile.changePage( "#homepage","slideup" );
				};
			});
    	}
    	  		
	});
	$.mobile.changePage( "#homepage","slideup" );
};//createEvents

init();
checkLogin();
var events;

$.getJSON('https://api.mongohq.com/databases/Tournaments4Gamers/collections/events/documents?_apikey=wc4gj9zp6pmmwt55zqak', function(data) {
	events = data;
});//

$('#editpage').live('click', function(e){
							
	//$('#editdescription').html(this.description);
});//editpage


$('#search').live('click', function(e){
	
	$("#searchlist").html("");
	$.mongohq.authenticate({ apikey: 'wc4gj9zp6pmmwt55zqak'});
	$.mongohq.documents.all({
  		db_name : 'Tournaments4Gamers',
  		col_name: 'events',
  		success : function(data){
    		
			$(events).each(function(){
  				$("#searchlist").append("<li><a data-eventid='"+this._id.$oid + "' href='#eventdetails'>" + this.name + "</a></li>").listview('refresh');
  				
  			});
  			
  			$("li a").click(function(){
  				
  				var tarID = $(this).data('eventid');
  				//console.log(tarID);
  				$(events).each(function(){
  					if(this._id.$oid == tarID){
  						
  						$("#tournamentname").html(this.name);
  						$("#eventdate").html(this.date);
  						$("#detailstarttime").html(this.start_time);
  						$("#detailendtime").html(this.end_time);
  						$("#detaillocation").html(this.location);
  						$("#detaildescription").html(this.description);
  								
  					}
  				});
  				
  			});  			
  		}
	});
	
});//search

$('#logout').live('click',function(e){
	logout();
	return false;
});//logout

$('#created-event-form').live('submit',function(e){
	var container = $('#created-event'),
		title = $('#title').val(),
		userDescription = $('#description').val(),
		date = $('#date').val(),
		start_time = $('#start_time').val(),
		end_time = $('#end_time').val(),
		location = $('#location').val(),
		startampm = $('#startampm').val(),
		people = [];
		
		//calculating time for Facebook API
		//var time = $('#time').val().substr(0,4) + ':00';
		//still being hard coded in
		//var time = start_time;
		var completeStart = date + ' ' + start_time;
		var timeCompleteStart = parseInt(Date.parse(completeStart)/1000);
		//createEvents(title,userDescription,people,timeComplete,location);
		
		
		var completeEnd = date + ' ' + end_time;
		//console.log(complete);
		var timeCompleteEnd = parseInt(Date.parse(completeEnd)/1000);
		
		console.log("non utc start: ", timeCompleteStart);
		console.log("non utc end: ", timeCompleteEnd);
		
		var utcYearEnd = new Date(completeEnd).getUTCFullYear(),
			utcMonthEnd = new Date(completeEnd).getUTCMonth(),
			utcDateEnd = new Date(completeEnd).getUTCDate(),
			utcHoursEnd = new Date(completeEnd).getUTCHours(),
			utcMinsEnd = new Date(completeEnd).getUTCMinutes();
			
		var utcYearStart = new Date(completeStart).getUTCFullYear(),
			utcMonthStart = new Date(completeStart).getUTCMonth(),
			utcDateStart = new Date(completeStart).getUTCDate(),
			utcHoursStart = new Date(completeStart).getUTCHours(),
			utcMinsStart = new Date(completeStart).getUTCMinutes();	
		
		var utcEnd = Date.UTC(utcYearEnd,utcMonthEnd,utcDateEnd,utcHoursEnd,utcMinsEnd,0);						
		var utcStart = Date.UTC(utcYearStart,utcMonthStart,utcDateStart,utcHoursStart,utcMinsStart,0);
		
		utcEnd = utcEnd.toString();
		utcStart = utcStart.toString();
		
		utcEnd = utcEnd.substr(0, 10);
		utcStart = utcStart.substr(0, 10);
		
		//utcEnd = parseInt(utcEnd);
		//utcStart = parseInt(utcStart);
		
		console.log("start date:   ",completeStart);
		console.log("end date:   ",completeEnd);
		
		console.log("start:   ",utcStart);
		console.log("end:   ",utcEnd);
		
		//createEvents(title,userDescription,people,timeCompleteStart,timeCompleteEnd,location);
		createEvents(title,userDescription,people,utcStart,utcEnd,location);
		//create event in database
		var data = 
				{
  					'name' : title,
  					'description' : userDescription,
  					'date' : date,
  					'start_time' : start_time,
  					'end_time' : end_time,
  					'location' : location
  				}
		
		//mongoCreateDocument(data);
		
		return false;
});//create-event-form



})(jQuery);