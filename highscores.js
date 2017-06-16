var highscore;
var message = ['You must enter a name',"No no, the name", "Ok puto, put tha name", "You should've known by now", "Easy does it","Still empty","I'm running out of messages",
"Or am I?", "*cricket sound*", "Hi, you name is. What?", "Your name is. Who?","Your name is..", "*tumbleweed passing*", "I give up", "You are looping now bitch"];
var message_no = 0;
function printScore(){

    if ($("#name").val().trim().length > 1 && $("#name").val()!= '' ){
        $(".new-highscore").hide();
        highscore_screen = false;
        resetScores();
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
    } else {
        $("#current-score").html(message[message_no]);
        message_no++;
        if (message_no >= message.length){
            message_no = 0;
        }
    }
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
    highscore_screen = true;
    var new_html = "Congratulations your score: "+ score;
    $("#current-score").html(new_html);
    $(".new-highscore").show();
    $(".mask").show();
    splash_music.currentTime = 0;
    splash_music.play();
}
printNames();
