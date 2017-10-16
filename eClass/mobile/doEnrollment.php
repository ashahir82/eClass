<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id']) && isset($_GET['username'])) {
	$data = array();
	
	$topic_id=sanitize($_GET['topic_id']);
	$username=sanitize($_GET['username']);
	
	$enrolltime = date("l, j M Y - H:i A");
	
	if (user_exists($username) === true && topic_exists($topic_id) === true) {
		$gotEnroll = mysql_query("SELECT * FROM `enroll` WHERE `topic_id` = $topic_id AND `username` = '$username'");
		if (mysql_num_rows($gotEnroll) == 0) {
			mysql_query("INSERT INTO `enroll` (`username`, `topic_id`, `datetime`) VALUES ('$username', $topic_id, '$enrolltime')");
		} else {
			$errors[]  = 'Topic aready enroll';
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