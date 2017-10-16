<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

if(isset($_GET['username']) && isset($_GET['new']) && isset($_GET['repeat'])) {
	$username=sanitize($_GET['username']);
	$new=sanitize($_GET['new']);
	$repeat=sanitize($_GET['repeat']);
	
	if (user_exists($username) === true) {
		$rowc = mysql_fetch_array(mysql_query("SELECT * FROM `users` WHERE `username` = '$username'"));
	} else {
		$errors[] = 'User not exists';
	}
	if (trim($_GET['new']) !== trim($_GET['repeat'])) {
		$errors[] = 'New password not match';
	}
	if (strlen($_GET['new']) < 8) {
		$errors[] = 'New password less than 8 character';
	}
	if (strlen($_GET['new']) > 32) {
		$errors[] = 'New password more than 32 character.';
	}
	
	if (empty($_GET) === false && empty($errors) === true) {
		$new = md5($new);
		mysql_query("UPDATE `users` SET `pass` = '$new' WHERE `username` = '$username'");
	}
} else {
	$errors[]  = 'No data has been send';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
} else {
	$rows['success']  = 'Password update successfull';
}
echo json_encode($rows);
?>