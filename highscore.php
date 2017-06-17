<?php
// connect to mysql server
if (isset($_REQUEST['score'])){
	$score = $_REQUEST['score'];
	$name = $_REQUEST['name'];
	$comment = $_REQUEST['comment'];
}

//-------------- SQL connection--------------------
$servername = "localhost";
$username = "root";
$password = "winstonblue";
// $password = "";

$sql2;
// Create connection
$db = new mysqli($servername, $username, $password) or die("cant connect");
// select the db name
 mysqli_select_db( $db, "pixelrambo");
if(isset($score)){
	$sql2 = "INSERT INTO `pixelrambo`.`pixelrambohighscore` (`id`, `name`, `score`, `comment`) VALUES (NULL, '$name', '$score', '$comment')";
	mysqli_query($db, $sql2);
}
// enter your sql query
$sql = "SELECT * FROM pixelrambohighscore WHERE score > 0 ORDER BY score desc LIMIT 10";
// Creates temp array variable
$temp = array();
// Gets table details
$result = mysqli_query($db,$sql);

// Adds each records/row to $temp
while($row=mysqli_fetch_row($result)) {
    $temp[] = $row;


}
// Formats json from temp and shows/print on page

 echo json_encode($temp);

?>