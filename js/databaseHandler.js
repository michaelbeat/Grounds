/* 
  This is the js file responsible for doing stuff with the firebase database.
  This file will have getters and setters for the database.
  The naming scheme for the database is simple.
	We name each ref based on the date objects getTime function.
	That way, each ref has a unique name.
*/

/* This is the database obj, this is initialized in the setup function. */
var database;

/* This is going to hold all of the refs that we have in the database when we call databaseGetAll() */
var allRefs = [];

/*
  This is the setup function for our firebase database.
  It initialized the database when we load this file.
*/
function setup(){
	var config = {
		apiKey: "AIzaSyARduvv2i7ud8f-RcBT-ZrXsxrnZTd1OdY",
		authDomain: "recycle-app-ea4f9.firebaseapp.com",
		databaseURL: "https://recycle-app-ea4f9.firebaseio.com",
		projectId: "recycle-app-ea4f9",
		storageBucket: "recycle-app-ea4f9.appspot.com",
		messagingSenderId: "1069829280623"
	};
	firebase.initializeApp(config);
	database = firebase.database();
}

/*
  This gets all the refs we have in the database, creates a new object from them, and then adds them to the allRefs array.
*/
function databaseGetAll(){
	var ref = database.ref();
	ref.on('value', function(snapshot) {
		allRefs = [];
		snapshot.forEach(function(keysSnapshot) {
			var keys = keysSnapshot.val();
			var newObj = new databaseObjRef(keys.id);
			allRefs.push(newObj);
		});
	});
}

/* 
  This retrieves a requested value from a ref, via the refPath and returns it.
*/
function databaseGet(refPath){
	var tref = database.ref(refPath);
	
	var result = new databaseObjRef();
	
	tref.once('value').then(function(snapshot) {
		if(snapshot.exists()){
			result.id = refPath;
			result.name = snapshot.val().name;
			result.location = snapshot.val().location;
			result.pickupType = snapshot.val().pickupType;
			result.completed = snapshot.val().completed;
		}
	}).then(function(){
		console.log(result);
	});
	return result;
}

/* 
  This function gets a requested value from the refPath. 
*/
function databaseGetValue(refPath, valName){
	var tref = database.ref(refPath);
	
	var result = new databaseObjRef();
	
	tref.once('value').then(function(snapshot) {
		if(snapshot.exists()){
			result.id = refPath;
			result.name = snapshot.val().name;
			result.location = snapshot.val().location;
			result.pickupType = snapshot.val().location;
			result.completed = snapshot.val().completed;
		}
	});
	if(valName in result){
		return result[""+valName];
	}else{
		return null;
	}
}

/* 
  This sets the value of a ref to a new databaseObjRef, or creates a new ref with the databaseObjRef passed.
*/
function databaseSet(refPath, databaseObject){
	var tref = database.ref(refPath);
	tref.update({
		name: databaseObject.name,
		location: databaseObject.location,
		pickupType: databaseObject.pickupType,
		id: databaseObject.id,
		completed: databaseObject.completed
	});
}

/* 
  This is used to set a specific value of a ref, using the refPath, the name of the value you would like to change, and the value you want to change it to. 
*/
function databaseSetValue(refPath, valueName, newValue){
	var tref = database.ref(refPath+"/"+valueName).set(newValue);
}

/*
  This removes an entire ref from the database using the refPath. 
*/
function databaseRemove(refPath){
	var tref = database.ref(refPath);
	
	var result = new databaseObjRef();
	
	tref.once('value').then(function(snapshot) {
		if(snapshot.exists()){
			if(!snapshot.hasChild("completed")){
				tref.remove();
			}else{
				result.id = refPath;
				result.name = snapshot.val().name;
				result.location = snapshot.val().location;
				result.pickupType = snapshot.val().location;
				result.completed = snapshot.val().completed;
				if(result.completed){
					tref.remove();
				}
			}
		}
	});
}

/*
  This is the databaseObjRef, which is a constructor that we use to easily pass data from the dayabase as one unified object.
*/
var databaseObjRef = function(){
	this.name = arguments[1] || "Not defined!";
	this.address = arguments[2] || "Not defined!";
  this.city = arguments[3] || "Not defined!";
  this.state = arguments[4] || "Not defined!";
  this.zipCode = arguments[5] || "Not defined!";
	this.pickupType = arguments[6] || "Not defined!";
	this.id = arguments[0] || (new Date()).getTime();
	this.completed = arguments[7] || false;
	this.enRoute = arguments[8] || -1;
  this.lat = arguments[9] || 0;
  this.long = arguments[10] || 0;
  this.imageUrl = arguments[11] || "Not defined!";
	
	/* If you want to use the data directly in the html doc, get the values from this function, that way we don't get any xss attacks. */
	this.sanitized = function(){
		return [
			this.name.replace("<", "&lt;"),
			this.name.replace(">", "&gt;"),
			this.location.replace("<", "&lt;"),
			this.location.replace(">", "&gt;"),
			this.address.replace("<", "&lt;"),
			this.address.replace(">", "&gt;"),
			this.pickupType.replace("<", "&lt;"),
			this.pickupType.replace(">", "&gt;"),
			this.id.replace("<", "&lt;"),
			this.id.replace(">", "&gt;"),
			this.completed.replace("<", "&lt;"),
			this.completed.replace(">", "&gt;"),
			this.enRoute.replace("<", "&lt;"),
			this.enRoute.replace(">", "&gt;")
		];
	}
	
	/* This adds this obj to the database. */
	this.addMe = function(){
		databaseSet(this.id, this);
	}
	
	/* Makes this object take its own life. */
	this.killMe = function(){
		this.setValue("completed", true);
		databaseRemove(this.id);
	}
	
	/* This sets the value of the object. */
	this.setValue = function(valueName, newValue){
		if(valueName != "id"){
			var other = this;
			other[valueName] = newValue;
			databaseSetValue(this.id, valueName, newValue);
		}
	}
	
	/* This updates the object with the database values. */
	this.update = function(snapshot){
		this.name = (snapshot.hasChild("name")) ? snapshot.val().name : "Not defined!";
		this.location = (snapshot.hasChild("location")) ? snapshot.val().location : "Not defined!";
		this.pickupType = (snapshot.hasChild("pickupType")) ? snapshot.val().pickupType : "Not defined!";
		this.id = (snapshot.hasChild("pickupType")) ? snapshot.val().id : this.id;
		this.completed = (snapshot.hasChild("completed")) ? snapshot.val().completed : "Not defined!";
	}
	
	/* Have to create other, because inside of the anon function this is bound to somthing else! */
	var other = this;
	database.ref(this.id).on("value", function(snapshot){
		other.update(snapshot);
	});
	
}

/* Important. This sets up the database for use in the program. */
setup();

/* This sets up all the previously created databaseObjRefs from the database, and puts them into the array, allRefs. */
databaseGetAll();
