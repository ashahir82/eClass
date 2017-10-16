<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

if(isset($_GET['username']) && isset($_GET['fullname']) && isset($_GET['email']) && isset($_GET['password']) && isset($_GET['confirm'])) {
	// username and password sent from Form
	$username=sanitize($_GET['username']);
	$fullname=sanitize($_GET['fullname']);
	$email=sanitize($_GET['email']);
	//Here converting passsword into MD5 encryption. 
	$pass=md5(sanitize($_GET['password']));
	$confirm=md5(sanitize($_GET['confirm']));
	
	if (user_exists($_GET['username']) === true) {
		$errors[] = 'Username \'' . $_GET['username'] . '\' already registered.';
	}
	if (preg_match("/\\s/", $_GET['username']) == true) {
		$errors[] = 'Username can\'t have spaces.';
	}
	if (email_exists($_GET['email']) === true) {
		$errors[] = 'Email address \'' . $_GET['email'] . '\' already registered.';
	}
	if (trim($_GET['password']) !== trim($_GET['confirm'])) {
		$errors[] = 'Password not match';
	}
	if (strlen($_GET['password']) < 8) {
		$errors[] = 'Password less than 8 character';
	}
	if (strlen($_GET['password']) > 32) {
		$errors[] = 'Password more than 32 character.';
	}
	if (empty($_GET) === false && empty($errors) === true) {
		mysql_query("INSERT INTO `users` (`username`, `fullname`, `email`, `pass`) VALUES ('$username', '$fullname', '$email', '$pass')");
	}
} else {
	$errors[]  = 'No data has been send';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
} else {
	$rows['success']  = 'Registration successfull';
}
echo json_encode($rows);
?>