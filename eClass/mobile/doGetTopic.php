<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['module_id']) && isset($_GET['username'])) {
	$module_id=sanitize($_GET['module_id']);
	$username=sanitize($_GET['username']);
	
	$result = mysql_query("SELECT `topic`.*, `enroll`.`note`, `enroll`.`quiz`, `enroll`.`active` FROM `topic` LEFT JOIN `enroll` ON `topic`.`topic_id` = `enroll`.`topic_id` WHERE `topic`.`module_id` = $module_id AND (`enroll`.`username` IS NULL OR `enroll`.`username` = '$username') ORDER BY `topic`.`le_no`");
	if (mysql_num_rows($result) != 0) {
		// output data of each row
		while ($row = mysql_fetch_array($result)) {
			$rows[] = array(
				'topic_id' => $row['topic_id'],
				'module_id' => $row['module_id'],
				'le_no' => ($row['le_no'] < 10) ? "0" . $row['le_no'] : $row['le_no'],
				'name' => $row['name'],
				'note' => $row['note'],
				'quiz' => $row['quiz'],
				'active' => $row['active']
			);
		}
	} else {
		$errors[]  = 'No topic found';
	}
} else {
	$errors[]  = 'No data has been send';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
}
echo json_encode($rows);
?>