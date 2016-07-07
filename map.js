//key for our data set = 1zWT_7x8ZJdX4tujkR7w2fRTWthrNLeV0ob1Rz3uo
//API authentication key = AIzaSyAaDz7T5vCbVA_8JD2jA-GzGUCSrlD5ZI0
//google.load('visualization', '1', { packages: ['corechart'] });
function initialize() 
{
	//INITIALIZE VARIABLES
	var year='2015'
	var species= 'Culex_Tarsalis'
	var virus = 'WNV';
	var county = 'allCounties'
	var numComparisons= 0;


	populateCountyOptions();

	//CREATE THE MAP
	var mapProp = 
	{
		center:new google.maps.LatLng(47.6,-100.4),
		zoom:7,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		scrollwheel: false
	};
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
	var layer = new google.maps.FusionTablesLayer();
	var numberLayer =  new google.maps.FusionTablesLayer();
	updateLayerQuery(layer,year);
	layer.setMap(map);

	//STYLE THE MAP AND CREATE THE LEGEND
	updateLayerBySpecies(layer,year,species);
	createLegend();

	//google.maps.event.addDomListener(window, 'load', initialize);

	google.maps.event.addDomListener(document.getElementById('year'),'change', function()  //LISTENS FOR THE CHANGE OF YEAR!
	{
		year = this.value;
		updateLayerQuery(layer,year);
		updateLegendContent();
	});
	google.maps.event.addDomListener(document.getElementById('species'),'change',function()//ONCE THIS EVENT FIRES, WE WANT THE MAP TO DISPLAY THE DENSITY OF THE SELECTED SPECIES BY COUNTY!
	{
		species=this.value; 
		updateLayerBySpecies(layer,year,species);
		updateLegendContent();	
	});
	google.maps.event.addDomListener(document.getElementById('countyOptions'),'change',function()//This will update the map to display only the selected county.
	{
		county = this.value;
		showCounty(county);	
	});
	
	//-----------------------------------------CREATE THE INFO WINDOW-----------------------------------------------------------------------
	google.maps.event.addListener(layer, 'click', function(e) 
	{ //listener for clicking on the map
		var totalMosquitos = e.row['Total_Mosquitoes'].value;
        var maxTemp = e.row['Max Temp (Abs)'].value;
		var minTemp =e.row['Min Temp (Abs)'].value;
		var bSoilTemp=e.row['Bare Soil Temp (Avg)'].value;
		var tSoilTemp=e.row['Turf Soil Temp (Avg)'].value;
		var totRain=e.row['Total Rainfall (Avg)'].value;
		var dewpoint=e.row['Dewpoint (Avg)'].value;
	    var county = e.row['NAME'].value;
	    var speciesDensity = e.row[species].value;
	    var currentYear = e.row['Year'].value;
	    var risk= '';
	    //alert("The Species is: "+ species +" The Value of SpeciesDensity is: "+speciesDensity)
		 if(species == 'tmale' || species == 'tfemale')
		 {
		
		 }
		 else
		 {
			 if(species == 'Culex_Tarsalis')
			 {
				  if (speciesDensity > 332) {
					risk = '<p class="high">High Risk for WNV!</p>'; //WHAT DEFINES HIGH RISK LOW RISK BY YEAR?
				  } else if (speciesDensity > 166) {
					risk = '<p class="medium">Medium Risk for WNV</p>';
				  } else {
					risk = '<p class="low">Low Risk for WNV</p>';
				  }
			 }
			 else
			 {
			 	risk='<br><br><strong> Non-Virus Carrying Species</strong>'
			 }
		}
		var infoWin='<strong>' + county + ' County Data For The Year: ' + currentYear + '</strong>'+
								'<br><br> Total recorded ' + species +' traps: ' + e.row[species].value + 
								 '<br>Total Human Cases: Coming Soon' +
								 risk; //PUTS TOGETHER THE DATA TO BE SHOWN IN THE INFO WINDOW!
	    e.infoWindowHtml =  infoWin;
	    updateGeneralData(year, county,totalMosquitos, maxTemp,minTemp,bSoilTemp,tSoilTemp,totRain,dewpoint);

		  
	});
//---------------------------------------END CREATE INFO WINDOW--------------------------------------------------------------------------







//-------------------------------------------------ALL FUNCTIONS | Source code adapted from: https://developers.google.com/fusiontables/docs/samples/adv_fusiontables -------------------------------------------------------------------------------------------------
	function updateLayerQuery(layer, year) 
	{
		if(county=='allCounties')
		{	
			var where = generateWhere(year);
		}
		else if(county!='allCounties')
		{	
			var where=generateWhereYC(year,county);
		}
		layer.setOptions({query:{select:'geometry',from:'1zWT_7x8ZJdX4tujkR7w2fRTWthrNLeV0ob1Rz3uo', where: where}});
		updateLayerBySpecies(layer, year, species);
    }
	function updateLayerBySpecies(layer,year, species) //6/26/16 This function properly maps the density of each individual species of mosquito
	{
		var colors=testCol; //testCol contains only three colors, green yellow and red, it reduces accuracy but looks clean
		var minNum= 0;
		var maxNum=500;
		var step= (maxNum-minNum) / colors.length;//Should be 500/3 = 166.7~
		//alert(step);
		var styles = new Array();
		for(var i=0;i<colors.length;i++) //Originally: Generates the conditions to color each polygon slightly more red with growing population iterates 22 times //Now it only does G.Y.R. based on density 
		{	
			var newMin = minNum + step *i;
			//alert(generateWhereYS(newMin,year,species)+ " Is filled with " + colors[i]);
			styles.push({where:generateWhereYS(newMin,year,species), polygonOptions: {fillColor:colors[i],fillOpacity: .5,strokeColor: '#000000', strokeWeight: 3}}); //gives just enough transparency so you can really get a feel for the map
		}
		layer.set('styles',styles);
		layer.setMap(map);
	}
	function generateWhere(year)
	{
		var whereClause = new Array();
        whereClause.push("Year = '");
        whereClause.push(year);
		whereClause.push("'")
        return whereClause.join('');
	}
	function generateWhereYC(year, county) //YC stands for year and county. This creates the conditions for year and county, is used to display only one county
	{
		var whereClause = new Array();
        whereClause.push("Year = '");
        whereClause.push(year);
		whereClause.push("'");
		whereClause.push("AND Counties = '");
		whereClause.push(county);
		whereClause.push("'");
        return whereClause.join('');
	}
	function generateWhereYS(minNum, year,species)//YS stands for year and species
	{ //adapeted from Calvins work
		var whereClause = new Array();
		whereClause.push("Year = '");
	    whereClause.push(year);
	    whereClause.push("' AND '");
	    whereClause.push(species);
	    whereClause.push("' >= ");
	    whereClause.push(minNum);
	    return whereClause.join('');
	}
	function createLegend()
	{
		var legend=document.getElementById('legend');
		updateLegendContent();
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
		document.getElementById('legend'));
	}
	function updateLegendContent()
	{
		var legend = document.getElementById('legend');
		var title = year + " " +species + ' Trap Count Density';
		legend.innerHTML = '<strong><center>' + title + '</strong></center>';
		var colors = ['green','yellow','red'] //GREEN, YELLOW, RED
		var range=[0,166,333];
		var riskLevel=['low','moderate','high'];
		for(var i=0; i < colors.length; i++)
		{
			var colorBox = document.createElement('div');
			colorBox.id=colors[i];
			colorBox.innerHTML='<strong><center> >' + range[i] + "  " + riskLevel[i];

			legend.appendChild(colorBox);
		}
	}
	function updateGeneralData(year, county,totalMosquitos, maxTemp,minTemp,bSoilTemp,tSoilTemp,totRain,dewpoint)
	{
		//CANNOT FIGURE OUT A WAY TO INCREMENT THE VARIABLE NUMCOMPARISONS WITHOUT REINITIALIZING IT TO 0 EACH TIME THE FUNCTION IS CALLED
		if(numComparisons==0)
		{
			
		}
		if(numComparisons<3)
		{
		var genData = document.createElement('div');
		genData.id = "generalData";
		//var genData = document.getElementById('generalData');

		var title= "General Data for " + county +" county for the Year: " + year;
		var info =        '<strong><center>' + title + '</strong></center>'
						  + "<br>Total Mosquitoes: " + totalMosquitos
						  +	"<br>Max Temperature: " + maxTemp
						  + "<br>Min Temperature: "	+ minTemp
						  + "<br>Bare Soil Temperature: "	+bSoilTemp
						  + "<br>Turf Soil Temperature: "	+tSoilTemp
						  + "<br>Total Rainfall: "	+totRain
						  + "<br>Dewpoint Average: "	+dewpoint;
		genData.innerHTML=info;//sets the inside of the div to our info variable
		document.body.appendChild(genData);

		numComparisons= numComparisons+1;//Used to increment the number of boxes on the screen, however it always rests to 0 when the function is called:/
		
		}
		else //WILL ONLY ALLOW YOU TO HAVE 3 COUNTY COMPARISONS AT ANY TIME
		{
			//alert("You can only have 3 county comparisons at any time. Please press clear to make another selection.");//Alert the user that they can only have 3 general data boxes at once
		}	
	}
	//--------------------REFERENCE CODE: http://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array----------------------------
	function populateCountyOptions()
	{
		var countyOption = document.getElementById('countyOptions')

		addOption(countyOption,'ALL COUNTIES','allCounties');
		for(var i=0;i<COUNTIES.length;i++)
		{
			addOption(countyOption,COUNTIES[i],COUNTIES[i]);
		}
	}
	function addOption(selectBox,text,value)
	{
		var option = document.createElement("OPTION");
		option.text = text;
		option.value = value;
		selectBox.options.add(option);
	}
	//-------------------------------------------------------------

	function showCounty(county)
	{
		if(county!='allCounties')
		{
			var where = generateWhereYC(year, county);
			layer.setOptions({query:{select:'geometry',from:'1zWT_7x8ZJdX4tujkR7w2fRTWthrNLeV0ob1Rz3uo', where: where}});
		}
		else if(county='allCounties')
		{
			var where = generateWhere(year);
			layer.setOptions({query:{select:'geometry',from:'1zWT_7x8ZJdX4tujkR7w2fRTWthrNLeV0ob1Rz3uo', where: where}});
		}
	}


}

