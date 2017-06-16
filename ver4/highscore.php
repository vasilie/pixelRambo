<?php
// connect to mysql server
$score = $_REQUEST['score'];
$name = $_REQUEST['name'];
$comment = $_REQUEST['comment'];
$db = mysql_connect('localhost', 'zoharica', 'winstonblue',zoharica_app) or die('Could not connect');
// select the db name
mysql_select_db(zoharica_app, $db);
if(isset($score)){
	$sql2 = "INSERT INTO `zoharica_app`.`highscore` (`id`, `name`, `score`, `comment`) VALUES (NULL, '$name', '$score', '$comment')";
}
// enter your sql query
mysql_query($sql2);
$sql = "SELECT * FROM highscore WHERE score > 0 ORDER BY score desc LIMIT 10";
// Creates temp array variable
$temp = array();
// Gets table details
$result = mysql_query($sql);

// Adds each records/row to $temp
while($row=mysql_fetch_row($result)) {
    $temp[] = $row;
}
// Formats json from temp and shows/print on page
echo json_encode($temp);
?>