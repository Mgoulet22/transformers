/*Transformer Object, transformerType should be 'A' for autobots and 'D' for decepticons
  name should be a string
  the ability attributes should be integers between 1 - 10 */

function Transformer(transformerType, name, strength, intelligence, speed, endurance, rank, courage, firePower, skill) {
    this.transformerType = transformerType;
    this.name = name;
    this.strength = strength;
    this.intelligence = intelligence;
    this.speed = speed;
    this.endurance = endurance;
    this.rank = rank;
    this.courage = courage;
    this.firePower = firePower;
    this.skill = skill;
    this.eliminated = false;
    this.overallRating = function () {return this.strength + this.intelligence + this.speed + this.endurance + this.firePower;};
    this.eliminate = function () {this.eliminated = true;};
}


/*Takes an array of transformers and sends them to battle against each other */

function goToWar(transformers) {
    var decepticons = makeTeam('D', transformers);
    var autobots = makeTeam('A', transformers);
    var numberOfBattles = fight(decepticons, autobots);
    displayResults(decepticons, autobots, numberOfBattles);
}

/*Takes a transformerType and an array of transformers, returns an array with the transformers on the team ordered by rank */

function makeTeam (transformerType, transformers) {
    var team = [];
    for (var x = 0; x < transformers.length; x++) {
        if (transformers[x].transformerType === transformerType) {
            team.push(transformers[x]) ;  
        }
    }
        
    //order by ranking
    team.sort(function(a, b) {return b.rank - a.rank;});
    return team;
}


/*Eliminates all transformers on a team */

function eliminateAll (team) {
    for (var x = 0; x < team.length; x++) {
        team[x].eliminate();
    }    
}
 
/* takes a team of decepticons and a team of autobots (Array of transformers) and makes them fight against each other */

function fight(decepticons, autobots) {
        
    var x = 0;
    
    while(decepticons[x] && autobots[x]) {
        
        if (!battle(decepticons[x], autobots[x])) {
            //game over, everybody dead.
            eliminateAll(decepticons);
            eliminateAll(autobots);
            x++; //we still count this as a battle
            break;
        }
        x++;
            
    }
    return x;
}
    
/* Two opponents will battle.  Returns true if fighting should go on, returns false if the game is over and no more battles are to take place */

function battle (opponent1, opponent2) {

    //if optimus prime or predaking face off against each other or a duplicate of each other game is over and all competitors are destroyed, return false.
    var pattern = /^(OPTIMUS PRIME|PREDAKING)$/i;
    if (pattern.test(opponent1.name) && pattern.test(opponent2.name)) {   
        return false;
    }
        
    //Otherwise the battle between the two opponents will continue.
    
    //Any transformer named optimus prime or predaking automatically wins their fight
    if (pattern.test(opponent1.name)) {
        opponent2.eliminate();
    }
    else if (pattern.test(opponent2.name)) {
        opponent1.eliminate();
    }        
    
    //If a fighter is down 4 or more points of courage and 3 or more points of strength compared to their opponent
    //the opponent wins because he has run away.
    //console.log("opponent1 Courage " + opponent1.courage + " opponent2 Courage " + opponet2.courage + " Difference: " + opponent1.courage - opponent2.courage);
    //console.log("opponent1 strenght " + opponent1.courage + " opponent2 Courage " + opponet2.courage + " Difference: " + opponent1.courage - opponent2.courage)
                
    else if ((opponent1.courage - opponent2.courage) >= 4  && (opponent1.strength - opponent2.strength) >= 3) {
        opponent2.eliminate();
    }
    else if ((opponent2.courage - opponent1.courage) >= 4  && (opponent2.strength - opponent1.strength) >= 3) {
        opponent1.eliminate();
    }    
    
    //if one of the fighers is 3 or more points of skill above their opponent they win
    else if ((opponent1.skill - opponent2.skill) >= 3) {
        opponent2.eliminate();
    }
    else if ((opponent2.skill - opponent1.skill) >= 3) {
        opponent1.eliminate();
    }
    
    //Otherwise, the winner is the transformer with the highest overall rating.
    else if (opponent1.overallRating() > opponent2.overallRating()) {
        opponent2.eliminate();
    }
    else if (opponent2.overallRating() > opponent1.overallRating()) {
        opponent1.eliminate();
    }
    
    //In the event of a tie, both transformers are destroyed
    else if (opponent1.overallRating() == opponent2.overallRating()) {
        opponent1.eliminate();
        opponent2.eliminate();
    }
    
    //the game will continue
    return true;
        
}
   
/*Calculate and displays the final results of the battle*/

function displayResults(decepticons, autobots, numberOfBattles) {
    var displayText = "";
    var decepticonsEliminated = getNumberEliminated(decepticons);
    var autobotsEliminated = getNumberEliminated(autobots);

    displayText += numberOfBattles + " battle" + (numberOfBattles > 1 ? 's' : '');
    
    /*This is the case where all transformers were destroyed, no winner, no survivors*/
    if ((decepticonsEliminated === decepticons.length) && (autobotsEliminated === autobots.length)) {
        displayText += "<br />All transformers were destroyed.  There is no winner.";
    }
    
    /*In the case of a tie, both teams eliminated the same number of opponents*/
    else if (decepticonsEliminated === autobotsEliminated) {
        displayText += "<br />There was a tie, both teams eliminated " + decepticonsEliminated + " opponents.";
        displayText += "<br />Survivors from the Decepticons: " + getSurvivors(decepticons);
        displayText += "<br />Survivors from the Autobots: " + getSurvivors(autobots);        
    }
    
    /*Autobots win*/
    else if (decepticonsEliminated > autobotsEliminated) {
        displayText += "<br />Winning Team (Autobots): " + getSurvivors(autobots);
        displayText += "<br />Survivors from the losing team (Decepticons): " + getSurvivors(decepticons);    
    }
    /*Decepticons win*/
    else if (autobotsEliminated > decepticonsEliminated) {
        displayText += "<br />Winning Team (Decepticons):" + getSurvivors(decepticons);
        displayText += "<br />Survivors from the losing team (Autobots): " + getSurvivors(autobots);
    }
    
    document.getElementById("fightResults").innerHTML = displayText;
}

/*Gets the number of transformers eliminated on a team*/

function getNumberEliminated(team) {
    var eliminated = 0;
    for (var x = 0; x < team.length; x++) {
        if (team[x].eliminated) {
            eliminated ++;
        }
    }   
    return eliminated;
}

/*Gets the list of survivors on a team*/

function getSurvivors(team) {
    var survivorsArray = [];
    
    for (var x = 0; x < team.length; x++) {
        if (!team[x].eliminated) {
            survivorsArray.push(team[x].name);
        }
    }
    return survivorsArray.join(", ");
}

