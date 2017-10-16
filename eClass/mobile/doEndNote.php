<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id']) && isset($_GET['username'])) {
	$topic_id=sanitize($_GET['topic_id']);
	$username=sanitize($_GET['username']);
	
	$endtime = date("l, j M Y - H:i A");
	
	if (user_exists($username) === true && topic_exists($topic_id) === true) {
		$gotEnroll = mysql_query("SELECT * FROM `enroll` WHERE `topic_id` = $topic_id AND `username` = '$username'");
		if (mysql_num_rows($gotEnroll) !== 0) {
			mysql_query("UPDATE `enroll` SET `note` = 1, `note_datetime` = '$endtime' WHERE `topic_id` = $topic_id AND `username` = '$username'");
		} else {
			$errors[]  = 'No enrollment record found';
		}
	} else {
		$errors[]  = 'User or Topic not exits';
	}
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
} else {
	$rows['success']  = 'Update successfull';
}
echo json_encode($rows);
?>