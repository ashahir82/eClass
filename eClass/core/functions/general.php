<?php
function logged_in_redirect() {
	if (logged_in() === true) {
		$URL="index.php";
		echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
		exit();
	}
}

function protect_page() {
	if (logged_in() === false) {
		$URL="index.php?p=protected";
		echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
		exit();
	}
}

function admin_protect() {
	global $user_data;
	if (has_access($user_data['id'], 1) === false) {
		$URL="index.php";
		echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
		exit();
	}
}

function instructor_protect() {
	global $user_data;
	if (has_access($user_data['user_id'], 1) === false && has_access($user_data['user_id'], 2) === false) {
		$URL="index.php";
		echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
		exit();
	}
}

function sanitize($data) {
	return htmlentities(strip_tags(mysql_real_escape_string($data)));
}

function array_sanitize (&$item) {
	$item =  htmlentities(strip_tags(mysql_real_escape_string($item)));
}

function output_errors($errors) {
	return '<ul><li>' . implode('</li><li>', $errors) . '</li></ul>';
}

function icon_onoff($value) {
	$value = (int)$value;
	if ($value == 0) {
		return '<img src="images/invalid.png" width="12" height="12" alt="inactive" />';
	} else if ($value == 1) {
		return '<img src="images/valid.png" width="12" height="12" alt="active" />';
	}
}
?>