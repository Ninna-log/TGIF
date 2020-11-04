var data = {};
var url = "https://api.propublica.org/congress/v1/113/house/members.json";
var init = {
    headers: {
        'X-API-Key': 'yUI7OPkoaOSkU7GasugcM7kcLeLxyK9IFI2Tc5s1',
    }
}

var appVue = new Vue({
    el: '#senatorsData',
    data: {
        senators: {}, // data.results[0].members // data que se utiliza para las operaciones de c/funcion
        statistics: {

            numberOfRepublicans: [],
            numberOfDemocrats: [],
            numberOfIndependents: [],
            totalMembers: 0,
            percentageOfRepublicans: 0,
            percentageOfDemocrats: 0,            // operaciones resultantes de c/funcion
            percentageOfIndependents: 0,
            percentageTotal: 0,
            leastLoyal: [],
            mostLoyal: [],
            leastEngaged: [],
            mostEngaged: [],
        },
    },
    methods: {

    }
});


if (document.title.includes("Senate")) {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
}
fetch(url, init)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        data = json;
        appVue.senators = data.results[0].members;
        dataFirstTable(appVue.senators);
        loyals(appVue.senators);
        engageds(appVue.senators);
        firstTable(appVue.statistics);

        //if (document.title.includes("Loyalty")) {
          //  tablesLoyalty();
        //}

        //else {
          //  tablesAttendance();
        //}
    }) 

//-- Number of senators of each party --//
//-- Average of votes of each party --//
function dataFirstTable(members) {

    var sumOfRepublicans = 0;
    var sumOfDemocrats = 0;
    var sumOfIndependents = 0;

    for (i = 0; i < members.length; i++) {
        if (members[i].party == "R") {
            appVue.statistics.numberOfRepublicans.push(members[i]); // cantidad de republicanos = numberOfRepublicans
            sumOfRepublicans += members[i].votes_with_party_pct; // total de votos a favor de los republicanos = sumOfRepublicans
        }
        else if (members[i].party == "D") {
            appVue.statistics.numberOfDemocrats.push(members[i]); // cantidad de democratas = numberOfDemocrats
            sumOfDemocrats += members[i].votes_with_party_pct; // total de votos a favor de los democratas = sumOfDemocrats
        }
        if (members[i].party == "ID") {
            appVue.statistics.numberOfIndependents.push(members[i]); // cantidad de independientes = numberOfIndependents
            sumOfIndependents += members[i].votes_with_party_pct; // total de votos a favor de los independientes = sumOfIndependents
        }
    }
    appVue.statistics.totalMembers = appVue.statistics.numberOfRepublicans.length + appVue.statistics.numberOfDemocrats.length + appVue.statistics.numberOfIndependents.length;
    appVue.statistics.percentageOfRepublicans = (sumOfRepublicans / appVue.statistics.numberOfRepublicans.length);
    appVue.statistics.percentageOfDemocrats = (sumOfDemocrats / appVue.statistics.numberOfDemocrats.length);
    appVue.statistics.percentageOfIndependents = (sumOfIndependents / appVue.statistics.numberOfIndependents.length != 0 ? appVue.statistics.numberOfIndependents.length : 1); // operador ternario
    appVue.statistics.percentageTotal = appVue.statistics.percentageOfRepublicans + appVue.statistics.percentageOfDemocrats + appVue.statistics.percentageOfIndependents;   
}


//-- Least loyal bottom 10% of party --//
//-- Most loyal top 10% of party --//
function loyals(members) {

    var bottom = [];
    var top = [];

    //--Measuring the 10% of members--//
    tenPercent = Math.ceil((members.length * 10) / 100); // Senate = 11 members // House = 45 members

    //--Least loyal bottom 10% of party --//
    // ordenando de menor a mayor los porcentajes de votos ganados por cada miembro del partido //
    bottom = members.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct);
    // Primero .slice() corta del arrary los 11 o 45 miembros y luego los guarda en el objeto statistics.leastLoyal
    appVue.statistics.leastLoyal = bottom.slice(0, tenPercent);

    //--Most loyal top 10% of party --//
    // ordenando de mayor a menor los porcentajes de votos ganados por cada miembro del partido //
    top = members.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct);
    // Primero .slice() corta del arrary los 11 o 45 miembros y luego los guarda en el objeto statistics.mostLoyal
    appVue.statistics.mostLoyal = top.slice(0, tenPercent);
}


//-- Least engaged bottom 10% of party --//
//-- Most engaged top 10% of party --//
function engageds(members) {

    var bottom = [];
    var top = [];

    //--Measuring the 10% of members--//
    tenPercent = Math.ceil((members.length * 10) / 100); // Senate = 11 members // House = 45 members

    //--Least engaged bottom 10% of party --//
    // ordenando de menor a mayor los porcentajes de votos perdidos por cada miembro del partido //
    bottom = members.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
    // Primero .slice() corta del arrary los 11 o 45 miembros y luego los guarda en el objeto statistics.leastEngaged
    appVue.statistics.leastEngaged = bottom.slice(0, tenPercent);

    //--Most engaged top 10% of party --//
    // ordenando de mayor a menor los porcentajes de votos perdidos por cada miembro del partido //
    top = members.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);
    // Primero .slice() corta del arrary los 11 o 45 miembros y luego los guarda en el objeto statistics.mostEngaged
    appVue.statistics.mostEngaged = top.slice(0, tenPercent);
}

function firstTable(members) {

    var members = appVue.statistics;
    tr = "<tr>";
    tr += "<td>" + members.numberOfRepublicans.length + "</td>"
    tr += "</tr>";
    document.getElementById("numberOfRepublicans").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.percentageOfRepublicans.toFixed() + "%" + "</td>";
    tr += "</tr>";
    document.getElementById("percentageOfRepublicans").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.numberOfDemocrats.length + "</td>";
    tr += "</tr>";
    document.getElementById("numberOfDemocrats").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.percentageOfDemocrats.toFixed() + "%" + "</td>";
    tr += "</tr>";
    document.getElementById("percentageOfDemocrats").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.numberOfIndependents.length + "</td>";
    tr += "</tr>";
    document.getElementById("numberOfIndependents").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.percentageOfIndependents.toFixed() + "%" + "</td>";
    tr += "</tr>";
    document.getElementById("percentageOfIndependents").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.totalMembers + "</td>";
    tr += "</tr>";
    document.getElementById("totalMembers").innerHTML += tr;
    tr = "<tr>";
    tr += "<td>" + members.percentageTotal.toFixed() + "%" + "</td>";
    tr += "</tr>";
    document.getElementById("percentageTotal").innerHTML += tr;
}


function tablesLoyalty(loyalty) {

    var tr = appVue.statistics.leastLoyal.map(loyals);
    function loyals(leastLoyal) {
        return "<tr><td><a href=" + leastLoyal.url + ">" + leastLoyal.first_name + " " + (leastLoyal.middle_name || "") + " " + leastLoyal.last_name + "</a></td>"
            + "<td>" + leastLoyal.total_votes + "</td>"
            + "<td>" + leastLoyal.votes_with_party_pct.toFixed() + "%" + "</td></tr>";
    }
    document.getElementById("leastLoyal").innerHTML += tr.join("");

    var tr = appVue.statistics.mostLoyal.map(loyals);
    function loyals(mostLoyal) {
        return "<tr><td><a href=" + mostLoyal.url + ">" + mostLoyal.first_name + " " + (mostLoyal.middle_name || "") + " " + mostLoyal.last_name + "</a></td>"
            + "<td>" + mostLoyal.total_votes + "</td>"
            + "<td>" + mostLoyal.votes_with_party_pct.toFixed() + "%" + "</td></tr>";
    }
    document.getElementById("mostLoyal").innerHTML += tr.join("");
}

function tablesAttendance(engageds) {

    var tr = appVue.statistics.leastEngaged.map(engaged);
    function engaged(leastEngaged) {
        return "<tr><td><a href=" + leastEngaged.url + ">" + leastEngaged.first_name + " " + (leastEngaged.middle_name || "") + " " + leastEngaged.last_name + "</a></td>"
            + "<td>" + leastEngaged.missed_votes + "</td>"
            + "<td>" + leastEngaged.missed_votes_pct.toFixed() + "%" + "</td></tr>";
    }
    document.getElementById("leastEngaged").innerHTML += tr.join("");

    var tr = appVue.statistics.mostEngaged.map(engaged);
    function engaged(mostEngaged) {
        return "<tr><td><a href=" + mostEngaged.url + ">" + mostEngaged.first_name + " " + (mostEngaged.middle_name || "") + " " + mostEngaged.last_name + "</a></td>"
            + "<td>" + mostEngaged.missed_votes + "</td>"
            + "<td>" + mostEngaged.missed_votes_pct.toFixed() + "%" + "</td></tr>";
    }
    document.getElementById("mostEngaged").innerHTML += tr.join("");
}






