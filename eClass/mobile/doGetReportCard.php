<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';

if(isset($_GET['topic_id']) && isset($_GET['username'])) {
	$topic_id=sanitize($_GET['topic_id']);
	$username=sanitize($_GET['username']);
	$rows = array();
	$rowsResult = array();
	
	$result = mysql_query("SELECT *, ROUND(AVG(`score`.`mark`)) AS scoreAVG, MAX(`score`.`mark`) AS scoreMAX, MIN(`score`.`mark`) AS scoreMIN, COUNT(`score`.`mark`) AS scoreCOUNT FROM `enroll` LEFT JOIN `topic` ON `enroll`.`topic_id` = `topic`.`topic_id` LEFT JOIN `score` ON `enroll`.`topic_id` = `score`.`topic_id` WHERE `enroll`.`topic_id` = $topic_id AND `enroll`.`username` = '$username'");
	if (mysql_num_rows($result) != 0) {
		// output data of each row
		while ($row = mysql_fetch_array($result)) {
			$resultS = mysql_query("SELECT * FROM `score` WHERE `topic_id` = $topic_id AND `username` = '$username' ORDER BY `score`.`score_id`");
			while ($rowResult = mysql_fetch_assoc($resultS)) {
				$rowsResult[] = array(
					'mark' => $rowResult['mark'],
					'datetime' => $rowResult['datetime']
				);
			}
			$rows[] = array(
				'topic_id' => $row['topic_id'],
				'leno' => ($row['le_no'] < 10) ? "0" . $row['le_no'] : $row['le_no'],
				'name' => $row['name'],
				'note' => $row['note'],
				'note_datetime' => $row['note_datetime'],
				'quiz' => $row['quiz'],
				'quiz_datetime' => $row['quiz_datetime'],
				'datetime' => $row['datetime'],
				'active' => $row['active'],
				'withdraw' => $row['withdraw'],
				'scoreAVG' => $row['scoreAVG'],
				'scoreMAX' => $row['scoreMAX'],
				'scoreMIN' => $row['scoreMIN'],
				'scoreCOUNT' => $row['scoreCOUNT'],
				'scores' => $rowsResult
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