var data = {};
var url = "https://api.propublica.org/congress/v1/113/house/members.json";
var init = {
    headers: {
        'X-API-Key': 'yUI7OPkoaOSkU7GasugcM7kcLeLxyK9IFI2Tc5s1',
    }
}

var appVue = new Vue({  
    el: '#senatorsData',  
    data:{
        senators: {}
    }
  }); 

if (document.title.includes("Senate")){
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}
    fetch(url,init)
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        data = json;
        appVue.senators = data.results[0].members;
        //dataCongress(data.results[0].members);
        
    })
    
  
function dataCongress(members){

    for(i=0; i<members.length; i++){
        var url = members[i].url;
        var full_name = members[i].first_name + " " + (members[i].middle_name ||"") + members[i].last_name;

        tr = "<tr>";
        tr += "<td><a href="+ url + ">" + full_name + "</a></td>";
        tr += "<td>" + members[i].party + "</td>";
        tr += "<td>" + members[i].state + "</td>";
        tr += "<td>" + members[i].seniority + "  years</td>";
        tr += "<td>" + members[i].votes_with_party_pct + " %</td>";
        tr += "</tr>";

        //document.getElementById("data").innerHTML += tr;
    }
}
