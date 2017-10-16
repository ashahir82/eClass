<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id']) && isset($_GET['username'])) {
	$data = array();
	
	$topic_id=sanitize($_GET['topic_id']);
	$username=sanitize($_GET['username']);
	
	$endtime = date("l, j M Y - H:i A");
	
	if (user_exists($username) === true && topic_exists($topic_id) === true) {
		$gotEnroll = mysql_query("SELECT * FROM `enroll` WHERE `topic_id` = $topic_id AND `username` = '$username'");
		if (mysql_num_rows($gotEnroll) !== 0) {
			mysql_query("UPDATE `enroll` SET `active` = 0, `withdraw` = '$endtime' WHERE `topic_id` = $topic_id AND `username` = '$username'");
		} else {
			$errors[]  = 'Topic not enroll';
		}
	} else {
		$errors[]  = 'Data not valid';
	}
} else {
	$errors[]  = 'No data has been send';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
} else {
	$rows['success']  = 'Profile update successfull';
}
echo json_encode($rows);
?>