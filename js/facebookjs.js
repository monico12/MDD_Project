


(function($){

//mongohq stuff
function mongoGetDocs(q){
  //var q = {"csvDays":"1"}
  $.ajax({
    url: 'https://api.mongohq.com/databases/Tournaments4Gamers/collections/events',
    type: 'GET',
    dataType: 'json',
    data: {
      "_apikey":"wc4gj9zp6pmmwt55zqak",
      
    },
    success: function(r) {
      //console.log("Mongo: success",r);
      data.arySpecials = r;
      getLocationIDs();
    },
    error: function(data) {
      console.log("Mongo: fail",data);
      return false;
    }
   });
}

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
}

mongoUpdateDocument = function(obj){
	$.ajax({
    url: 'https://api.mongohq.com/databases/Tournaments4Gamers/collections/events/documents',
    type: 'PUT',
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
}





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

		}else{
			$.mobile.changePage( "#homepage", "slideup" );
		}
	});
}

logout = function(){
	FB.logout(function(response) {
 		$.mobile.changePage( "#loginpage", "slideup" );
	});
}

init = function(){
	FB.getLoginStatus(function(response){
		if(response.status == 'connected'){
			$.mobile.changePage("#homepage","slideup");
			//grabing my likes and shoving them into an object
			FB.api('/me/likes', function(response){
				$(response.data).each(function(i){
					
				});
			});
		}else{
			$.mobile.changePage( "#homepage", "slideup" );
		};
	});
};

login = function(){
	FB.api('/me', function(response) {
		//localStorage.setItem('fb_me', JSON.stringify(response));
		$.mobile.changePage( "#homepage", "slideup" );
	});
};

createEvents = function(title,userDesc,people,time,location){
	FB.api('/me/events','post',{name:title,start_time:time,location:location,description:userDesc},function(resp) {
    	var newId = resp.id;
		FB.api('/' + newId + '/invited?users='+people, 'post', function(response){
			if(response == true){
				$.mobile.changePage( "#homepage","slideup" );
			};
		});	  		
	});
	$.mobile.changePage( "#homepage","slideup" );
};

createEventOnDB = function(){
	//
	//$.mongohq.authenticate({ apikey: 'wc4gj9zp6pmmwt55zqak'});
	$.moongohq.authenticate({url: 'https://api.mongohq.com',apikey: 'wc4gj9zp6pmmwt55zqak'});
	$.mongohq.documents.create({
   		data: {'name' : 'herpderp'},
   		db_name : 'Tournaments4Gamers',
   		col_name: 'events',
   		success : function(db){ alert(db) },
   		error : function(message){ alert('error') }
	});
};


$(document).ready(function(){
init();
var events;

$.getJSON('https://api.mongohq.com/databases/Tournaments4Gamers/collections/events/documents?_apikey=wc4gj9zp6pmmwt55zqak', function(data) {
	events = data;
	console.log(data);
});

//$(jsonData.Featured).each(function(){
  //	$("#prodList").append("<li><a data-prodID='"+this.itemID + "' href='#prodDetail'>" + this.title + "</a></li>");	
  //});


$('#search').live('click', function(e){
	
	$("#searchlist").html("");
	$.mongohq.authenticate({ apikey: 'wc4gj9zp6pmmwt55zqak'});
	$.mongohq.documents.all({
  		db_name : 'Tournaments4Gamers',
  		col_name: 'events',
  		success : function(data){
    		/*for(i in data){
				$("#searchlist").append("<li><a href='#eventdetails' id='events'>" + data[i].name + "</a></li>");
			}*/
			$(events).each(function(){
  				$("#searchlist").append("<li><a data-eventid='"+this._id.$oid + "' href='#eventdetails'>" + this.name + "</a></li>");
  				console.log(this._id.$oid);
  				//eventID = this._id.$oid;
  			});
  			
  			$("li a").click(function(){
  				var tarID = $(this).data('eventid');
  				console.log(tarID);
  				$(events).each(function(){
  					if(this._id.$oid == tarID){
  						$("#tournamentname").html(this.name);
  						$("#eventdate").html("Date: " + this.date);
  						$("#start_time").html("From:  " + this.start_time);
  						$("#end_time").html("To:  " + this.end_time);
  						$("#detaildescription").html(this.description);
  					}
  				});
  			});  			
  		}
	});
	
	
 
	
});
/*
  $("li a").click(function(){
  	var tarID = $(this).data('eventid');
  	
  	$(events).each(function(){
  		//if(this.itemID == tarID){
  			$("#tournamentname").html(this.name);
  			$("#eventdate").html("Date: " + this.date);
  			$("#start_time").html("From:  " + this.start_time);
  			$("#end_time").html("To:  " + this.end_time);
  			$("#detaildescription").html(this.description);
  		//}
  	});
  });*/


$('#logout').live('click',function(e){
	logout();
	return false;
});


$('#created-event-form').live('submit',function(e){
	var container = $('#created-event'),
		title = $('#title').val(),
		userDescription = $('#description').val(),
		date = $('#date').val(),
		start_time = $('#start_time').val(),
		end_time = $('#end_time').val(),
		location = $('#location').val(),
		people = [];
		
		
		//calculating time for Facebook API
		//var time = $('#time').val().substr(0,4) + ':00';
		//still being hard coded in
		var time = end_time;
		var complete = date + ' ' + time;
		console.log(complete);
		var timeComplete = parseInt(Date.parse(complete)/1000);
		console.log(timeComplete);
		createEvents(title,userDescription,people,timeComplete,location);
		
		
		//create event in database
		
		var data = 
				{
  					'name' : title,
  					'description' : userDescription,
  					'date' : date,
  					'start_time' : start_time,
  					'end_time' : end_time
  				}
		
		mongoCreateDocument(data);
		/*
		var data = {
  					'name' = 'new tourny',
  					'date' = '09/09/2012',
  					'description' = 'blah blah blah blah blah',
  					'game' = 'Street Fighter',
  					'start_time' = '4:00 pm',
  					'end_time' = '8:00 pm',
  					'tournament_type' = 'online'
  				};
		
			$.mongohq.authenticate({ apikey: 'wc4gj9zp6pmmwt55zqak'});
			$.mongohq.documents.create({
  				db_name : 'Tournaments4Gamers',
  				col_name: 'events',
  				success : function(data){
    				console.log("event created");
  				}
			});
		*/
		
		return false;
});


});

})(jQuery);