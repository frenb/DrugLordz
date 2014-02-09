var score = 0;
var money = 100;
var currentMenuId;
var eventTiming = 5000;
var previousEvents=[];
var $form;

var drugInventory = {
	"marijuana":0,
	"cocaine":0,
	"heroine":0,
	"acid":0,
	"add":function(drugName,amount)
	{
		this[drugName]+=amount
	},
	"remove":function(drugName,amount)
	{
		this[drugName]-=amount
	}
}

var drugs = ["marijuana","cocaine","heroine","acid"];
var prices = {
	"marijuana":20,
	"cocaine":200,
	"heroine":150,
	"acid":50
}
var wholesale_prices = {
	"marijuana":15,
	"cocaine":100,
	"heroine":100,
	"acid":20
}
var drugAmountsFound=[20,50,75,100];
var drugAmountsRequested=[20,20,20,50,50,75,75,100,150,180,200,220,240,260,300,400,500,800,1000]
var spikeMultiplier = {
	"high":1.5,
	"medium": 1.3,
	"low":1.1
}
var events = ["drugs_found","drug_buy","price_spike","cop_bust","drug_buy","drug_buy","wholesale_drug_buy"];

var getRandomEntry = function(arr)
{
	return arr[Math.floor(Math.random() * arr.length)]
}

var eventHandlers = {
	"drugs_found":function(){
		var drugAmountFound = getRandomEntry(drugAmountsFound);
		var drugFound = getRandomEntry(drugs);
		drugInventory[drugFound]=parseInt(drugInventory[drugFound])+parseInt(drugAmountFound);
		//toggleMenu("drug_found_dialog", drugFound,drugAmountFound)
		$("#drug_found_name").text(drugFound);
		$("#drug_found_amount").text(drugAmountFound);
		$( "#drug_found_dialog" ).dialog({
      			modal: true,
      			buttons: {
        			Ok: function() {
          				$( this ).dialog( "close" );
        			}
      			}
    	});
		updateEvents("drugs found");
	},
	"drug_buy":function(){
		var drugAmountRequested = getRandomEntry(drugAmountsRequested);
		var drugBought = getRandomEntry(drugs);
		var currentDrugInventory = drugInventory[drugBought];
		if(currentDrugInventory< drugAmountRequested){
			updateAlerts("you don't have enough inventory to support the sale of " + drugAmountRequested + " ounces of " + drugBought);
		}
		else{
			//toggleMenu("drug_sold_dialog", drugBought,drugAmountRequested)
			$("#drug_sold_amount").text(drugAmountRequested);
			$("#drug_sold_name").text(drugBought);
			$( "#drug_sold_dialog" ).dialog({
      			modal: true,
      			buttons: {
        			Ok: function() {
          				$( this ).dialog( "close" );
        			}
      			}
    		});
			drugInventory["remove"](drugBought,parseInt(drugAmountRequested));
			money+=prices[drugBought]*parseInt(drugAmountRequested);
		}
		
		updateEvents("drug buy");
	},
	"price_spike":function(){
		updateEvents("price spike");
		var drugSpike = getRandomEntry(drugs);
		$("#drug_spike_name").text(drugSpike);
		$( "#drug_spike_dialog" ).dialog({
      			modal: true,
      			buttons: {
        			Ok: function() {

          				$( this ).dialog( "close" );
        			},
        			Cancel: function(){
        				$(this).dialog("close");
        			}
      			}
    		});
	},
	"cop_bust":function(){
		updateEvents("cop bust");
	},
	"wholesale_drug_buy":function(){
		//while(true){
			//var drug = prompt("Which drug would you like to buy");
			//toggleMenu("wholesale_buy");
			if($("#wholesale_buy_dialog"))
			{
				$( "#wholesale_buy_dialog" ).dialog({
      				modal: true,
      				buttons: {
        				Ok: function() {
          					$( this ).dialog( "close" );
        				},
        				Cancel: function(){
        					$(this).dialog("close");
        				}
      				}
    			});

			}		
			updateEvents("wholesale drug buy");
	}
}

var wholesale_drug_buy=function(myDrug)
{
	var drug;
	if(myDrug)
	{
		drug = myDrug;
	}
	else
		drug = $(this).attr("data-drug");
	
	if(drug!=null)
	{
		//toggleMenu("purchase_dialog", drug);
		$("#purchase_drug_name").text(drug);
		$( "#purchase_dialog" ).dialog({
      			modal: true,
      			buttons: {
        			Ok: function() {
        				var quantity = $("#purchase_amount").val();
        				updateEvents("purchase_ok " + quantity + " " + drug)
						var purchaseAmount = parseInt(quantity) * wholesale_prices[drug];
						
						if(purchaseAmount <= money)
						{
							updateAlerts("You successfully purchased the drugs");
							money -= purchaseAmount;
							drugInventory["add"](drug,parseInt(quantity));
							updateEvents("Purchase completed");
							//$.colorbox.close();
						}
						else
						{
							updateAlerts("You did not have enough money to make this purchase")
						}
						$("#purchase_amount").val("");
          				$( this ).dialog( "close" );
        			},
        			Cancel: function(){
        				$("#purchase_amount").val("");
        				$(this).dialog("close");
        			}
      			}
    	});
	}
}

var inventoryDisplay = function()
{
	var display;
	for(var i=0;i<drugs.length;i++)
	{
		$("#"+drugs[i]).text(drugInventory[drugs[i]]);
	}
}

var gameLoop = function()
{
	//$.colorbox.close()
	var myEvent = getRandomEntry(events);
	eventHandlers[myEvent]();
}

var toggleMenuDataDash = function()
{
	var id = $(this).attr("data-dialog")
	toggleMenu(id);
}

var toggleMenu = function(id,drug_name,drug_amount)
{
	var html = $("#"+id).html();
	if(drug_name)
		html = html.replace(/@@drug_name/ig,drug_name);
	if(drug_amount)
		html = html.replace(/@@drug_amount/ig,drug_amount);
	//$.colorbox({opacity:1.00,trapFocus:true, html:html,closeButton:false});

	currentMenuId=id;
}

var updateEvents = function(message)
{
	previousEvents.push(message);
	$("#events").text(message);
	$("#inventory").text(inventoryDisplay());	
	$("#money").text("money: " + money);	
}
var updateAlerts=function(message)
{
	previousEvents.push(message);
	$("#alerts").text(message);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

$(document).ready(function(){
	gameLoop();
	for(var i=0;i<drugs.length;i++)
	{
		$("#"+drugs[i]+"_button").click(function(){
			wholesale_drug_buy($(this).attr("data-drug"))
		});
	}
	$("#continueButton").click(gameLoop);
	$("#inventory_button").click(function(){
		var href_value = "inventory.htm?"
		for(var i=0;i<drugs.length;i++)
		{
			href_value+=drugs[i] + "=" + drugInventory[drugs[i]] + "&";
		}
		$(this).attr({"href":href_value})
	});
	$("#wholesale_buy").click(toggleMenu);
	$(document).on('pageshow', '#inventory', function (data) {
    	inventoryDisplay();
	});

});

