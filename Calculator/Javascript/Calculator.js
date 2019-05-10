$(document).ready(function(){
	$(".select").hover(function() {
		$(this).css("filter", "opacity(70%)");
		$(this).css("transition","filter 0.4s");
	}, function() {
		$(this).css("filter", "none");
		$(this).css("transition","filter 0.4s");
	});
	
	var itemCounter = 0;
	var moneyCounter = 0.00;
	
	$(".select").click(function() {	
		itemCounter++;
		$("#itemCounter").text(itemCounter);
		
	if (itemCounter == 10) {
		$("#bin").attr("src", "../Images/recycling-bin-1.png");
	} else if (itemCounter == 20) {
		$("#bin").attr("src", "../Images/recycling-bin-2.png");
	} else if (itemCounter == 30) {
		$("#bin").attr("src", "../Images/recycling-bin-3.png");
	}
	});
	
	$("#aluminum").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#plastic").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#drinkBox").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#gableTop").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#glass").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#biMetal").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#pouch").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#pCup").click(function() {
		moneyCounter = moneyCounter + 0.05;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#waterBox").click(function() {
		moneyCounter = moneyCounter + 0.20;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});

	$("#liqPlastic").click(function() {
		moneyCounter = moneyCounter + 0.10;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#liqGlass").click(function() {
		moneyCounter = moneyCounter + 0.10;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
	
	$("#liqBox").click(function() {
		moneyCounter = moneyCounter + 0.20;
		$("#moneyCounter").text("$" + Number.parseFloat(moneyCounter).toFixed(2));
	});
});