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
	allRefs = [];
	var ref = database.ref();
	ref.on('value', function(snapshot) {
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
	this.location = arguments[2] || "Not defined!";
	this.address = arguments[3] || "Not defined!";
	this.pickupType = arguments[4] || "Not defined!";
	this.id = arguments[0] || (new Date()).getTime();
	this.completed = arguments[5] || false;
	this.enRoute = arguments[6] || -1;
	
	/* Make sure you call this after you set the values, that way we don't get any xss attacks. */
	this.sanitize = function(){
		this.name.replace("<", "");
		this.name.replace(">", "");
		this.location.replace("<", "");
		this.location.replace(">", "");
		this.address.replace("<", "");
		this.address.replace(">", "");
		this.pickupType.replace("<", "");
		this.pickupType.replace(">", "");
		this.id.replace("<", "");
		this.id.replace(">", "");
		this.completed.replace("<", "");
		this.completed.replace(">", "");
		this.enRoute.replace("<", "");
		this.enRoute.replace(">", "");
	}
	
	/* This adds this obj to the database. */
	this.addMe = function(){
		databaseSet(this.id, this);
	}
	
	/* This sets the value of the object. */
	this.setValue = function(valueName, newValue){
		var other = this;
		other[valueName] = newValue;
		databaseSetValue(this.id, valueName, newValue);
	}
	
	/* This updates the object with the database values. */
	this.update = function(snapshot){
		this.name = snapshot.val().name;
		this.location = snapshot.val().location;
		this.pickupType = snapshot.val().pickupType;
		this.id = snapshot.val().id;
		this.completed = snapshot.val().completed;
	}
	
	/* Have to create other, because inside of the anon function this is bound to somthing else! */
	var other = this;
	database.ref(this.id).on("value", function(snapshot){
		other.update(snapshot);
		console.log("updated!");
	});
	
}

/* Important. This sets up the database for use in the program. */
setup();