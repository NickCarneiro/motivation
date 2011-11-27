/* Author: Nick Carneiro

*/
//IIFE module
var motivation = (function(){

//contains all functions for messing with dom
var ui = {
	renderAll: function(){
		$("#data_container").html('');
		$( "#day_template" ).tmpl( data.list ).appendTo( "#data_container" );
		
	}
};

//contains functions for getting and pushing data from server
var data = {
	user_id: "12345",
	current_date: (new Date()).getTime() ,
	//list array contains ALL of the user's data
	//assume it is sorted in reverse chronological order
	list: [] , //see reference list array below

	init: function(){
		data.user_id = $("#user_id").val();
		//pull in data from localStorage
		this.loadList();
		//render everything
		data.updateAllDates();
		ui.renderAll();
	} ,
	loadList: function(){
		var store = JSON.parse(localStorage.getItem("motivation"));
		if(store != null){
			this.list = store;
		}
		
	},
/* reference list array 

list: [
		{	date: 628664265000,
			date_string: undefined,
			accomplished: ["Took out the trash", "walked the dog"],
			regret: ["ran red light", "stole candy from baby again"],
			goals: ["meet librarian"]
		} ,
		{	date: 628577865000,
			date_string: undefined,
			accomplished: ["Got born", "walked the dog"],
			regret: ["punched a cop", "stole candy from baby"],
			goals: ["make sandwich", "become president"]
		} 
		
	] 
*/

	//MILLI A MILLI A MILLI
	millisToNiceString: function(millis){
		var d = new Date(millis);
		var weekday = [];
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";

		var month = [];
		month[0]="January";
		month[1]="February";
		month[2]="March";
		month[3]="April";
		month[4]="May";
		month[5]="June";
		month[6]="July";
		month[7]="August";
		month[8]="September";
		month[9]="October";
		month[10]="November";
		month[11]="December";
		return weekday[d.getDay()] + " " + month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	} ,
	updateAllDates: function(){
		this.updateCurrentDate();
		this.current_date_string = this.millisToNiceString(this.current_date);
		for(var i = 0; i < this.list.length; i++){
			this.list[i].date_string = this.millisToNiceString(this.list[i].date);
		}
	},
	updateCurrentDate: function(){
		this.current_date = (new Date()).getTime();
		this.current_date_string = this.millisToNiceString(this.current_date);
	},
	addItem: function(item, col){
		this.updateCurrentDate();
		if(data.list.length > 0 && data.list[0].date_string === data.current_date_string){
			
			//add to current day
			this.addToToday(item, col);
		} else {
			//create a day for today
			var now = (new Date()).getTime();
			var now_string = data.millisToNiceString(now)
			var new_day = 
				{
					date: now,
					date_string: now_string,
					accomplished: [],
					regret: [],
					goals: []
				}
			
			
			data.list.unshift(new_day);
			this.addToToday(item,col);
		}

		//persist everything in localStorage
		localStorage.setItem("motivation", JSON.stringify(this.list));
	} ,
	//push item onto today's appropriate column
	addToToday: function(item, col){
		if(col === "accomplished"){
			data.list[0].accomplished.push(item);
		} else if(col === "regret"){
			data.list[0].regret.push(item);
		} else if(col === "goals") {
			data.list[0].goals.push(item);
		} else {
			console.log("fatal error. unknown col in addToToday.");
		}

		
	}

};



//jquery ready
$(function(){
	var d = new Date();
	

	//wire up all UI events
	$("#accomplished_input").keyup(function(e){
		if(e.which === 13){
			data.addItem($(this).val(), "accomplished");
			$(this).val("");
			ui.renderAll();
		}
	});

	$("#regret_input").keyup(function(e){
		if(e.which === 13){
			data.addItem($(this).val(), "regret");
			$(this).val("");
			ui.renderAll();
		}
	});

	$("#goals_input").keyup(function(e){
		if(e.which === 13){
			data.addItem($(this).val(), "goals");
			$(this).val("");
			ui.renderAll();
		}
	});

	//load in data
	data.init();

}); //end jquery ready


return data;
})();

