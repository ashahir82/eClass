<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

$rows = array();
//$result = mysql_query("SELECT * FROM `course`");
$result = mysql_query("SELECT `course`.*, COUNT(`module`.`module_id`) AS CountM FROM `course` LEFT JOIN `module` ON `course`.`course_id` = `module`.`course_id` GROUP BY `course`.`course_id`");
if (mysql_num_rows($result) != 0) {
	// output data of each row
	while ($row = mysql_fetch_assoc($result)) {
		$rows[] = array(
			'id' => $row['course_id'],
			'name' => $row['name'],
			'description' => $row['description'],
			'CountM' => $row['CountM']
		);
	}
} else {
	
}
echo json_encode($rows);
?>