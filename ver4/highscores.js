var highscore;
function printScore(){
    $(".new-highscore").hide();
    $(".mask").hide();
    $.ajax({
    	url: "highscore.php",
    	type: "POST",
    	data: {
    		name : $("#name").val(),
    		score : score
    		// comment : comment
    	}, 
    	success: function(result){
        highscore = result;
        printNames(); 
    }});

}
function printNames(){
    var current_html = ""; 
    $.ajax({
        url: "highscore.php",
        success: function(result){
        highscore = result;  
        var parsed_score = JSON.parse(highscore);
        for (i in parsed_score){
            var ime = parsed_score[i][1];
            var skor = parsed_score[i][2];
            console.log(ime);
            console.log(skor);
            current_html += "<li>" + ime + " : " + skor+"</li>";
            $(".imena").html(current_html);
            console.log(current_html);

        }
             
    }});
	
}
function showNewHighscore(){
    var new_html = "Congratulations your score: "+ score;
    $("#current-score").html(new_html);
    $(".new-highscore").show();
    $(".mask").show();
}
printNames();
