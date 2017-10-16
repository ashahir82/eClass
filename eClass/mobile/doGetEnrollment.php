<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

if(isset($_GET['username'])) {
	$username=sanitize($_GET['username']);
	$rows = array();
	$rowsResult = array();
	
	$module = mysql_query("SELECT `module`.`module_id`, `module`.`name`, `module`.`code` FROM `enroll` RIGHT JOIN `topic` ON `enroll`.`topic_id` = `topic`.`topic_id` RIGHT JOIN `module` ON `topic`.`module_id` = `module`.`module_id` WHERE `username` = '$username' GROUP BY `module`.`module_id`");
	if (mysql_num_rows($module) != 0) {
		// output data of each row
		while ($rowModule = mysql_fetch_assoc($module)) {
			$rowsResult = array();
			$result = mysql_query("SELECT * FROM `enroll` RIGHT JOIN `topic` ON `enroll`.`topic_id` = `topic`.`topic_id` WHERE (`username` IS NULL OR `username` = '$username') AND `module_id` = " . $rowModule['module_id'] . " ORDER BY `topic`.`le_no`");
			while ($rowResult = mysql_fetch_assoc($result)) {
				$rowsResult[] = array(
					'leno' => ($rowResult['le_no'] < 10) ? "0" . $rowResult['le_no'] : $rowResult['le_no'],
					'topic' => $rowResult['topic_id'],
					'name' => $rowResult['name'],
					'datetime' => $rowResult['datetime'],
					'note' => $rowResult['note'],
					'quiz' => $rowResult['quiz'],
					'active' => $rowResult['active']
				);
			}
			$rows[] = array(
				'module_id' => $rowModule['module_id'],
				'name' => $rowModule['name'],
				'code' => $rowModule['code'],
				'topics' => $rowsResult
			);
		}
	} else {
		$errors[]  = 'No record found';
	}
} else {
	$errors[]  = 'No data has been send';
}
if (!empty($errors)) {
	$rows['errors']  = $errors;
}
echo json_encode($rows);
?>