<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

if(isset($_GET['username']) && isset($_GET['password'])) {
	// username and password sent from Form
	$username=sanitize($_GET['username']);
	//Here converting passsword into MD5 encryption. 
	$password=md5(sanitize($_GET['password']));
	
	$query = mysql_query("SELECT * FROM `users` WHERE `username` = '$username' AND `pass` = '$password' AND `active` = 1");
	if (mysql_num_rows($query) == 1) {
		$row = mysql_fetch_assoc($query);
		
		//log last login
		$logintime = date("l, j M Y - H:i A");
		mysql_query("UPDATE `users` SET `last_login` = '$logintime' WHERE `id` = " . $row['id']);
		
		echo 'login_done';
	} else {
		echo 'error1';
	}
} else {
	echo 'error2';
}
?>