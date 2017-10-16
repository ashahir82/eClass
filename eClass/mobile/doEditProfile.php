<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

$mode_allowed = array('edit', 'add');
if (isset($_GET['mode']) === true && in_array($_GET['mode'], $mode_allowed) === true) {
	if ($_GET['mode'] === 'edit') {
		if(isset($_GET['username']) && isset($_GET['fullname']) && isset($_GET['email']) && isset($_GET['active'])) {
			$username=sanitize($_GET['username']);
			$fullname=sanitize($_GET['fullname']);
			$email=sanitize($_GET['email']);
			$active=sanitize($_GET['active']);
			($active === 'true') ? $active = 1 : $active = 0;
			
			if (user_exists($username) === true) {
				$rowc = mysql_fetch_array(mysql_query("SELECT * FROM `users` WHERE `username` = '$username'"));
			} else {
				$errors[] = 'User not exists';
			}
			
			if (email_exists($_GET['email']) === true && $rowc['email'] !== $_GET['email']) {
				$errors[] = 'Alamat email \'' . $_GET['email'] . '\' sudah didaftarkan.';
			}
			
			if (empty($_GET) === false && empty($errors) === true) {
				mysql_query("UPDATE `users` SET `fullname` = '$fullname', `email` = '$email', `active` = $active WHERE `username` = '$username'");
			}
		} else {
			$errors[]  = 'No data has been send';
		}
	} else if ($_GET['mode'] === 'add') {
		$errors[]  = 'Add';
	}
} else {
	$errors[]  = 'Mode not allowed';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
} else {
	$rows['success']  = 'Profile update successfull';
}
echo json_encode($rows);
?>