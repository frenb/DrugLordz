var drugs = ["marijuana","cocaine","heroine","acid"];
for(var i=0;i<drugs.length;i++)
{
	console.log(Arg(drugs[i]));
	$("#"+drugs[i]).text(Arg(drugs[i]));
}
