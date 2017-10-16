<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id']) && isset($_GET['username'])) {
	$topic_id=sanitize($_GET['topic_id']);
	$username=sanitize($_GET['username']);
	
	$result = mysql_query("SELECT * FROM `topic` WHERE `topic_id` = $topic_id");
	if (mysql_num_rows($result) != 0) {
		// output data of each row
		while ($row = mysql_fetch_array($result)) {
			//check enroll
			$gEnroll = false;
			$gotEnroll = mysql_query("SELECT * FROM `enroll` WHERE `topic_id` = $topic_id AND `username` = '$username' AND `active` = 1");
			if (mysql_num_rows($gotEnroll) != 0) {
				$gEnroll = true;
			}
			//check note
			$gNote = false;
			$gotNote = mysql_query("SELECT * FROM `note` WHERE `topic_id` = $topic_id");
			if (mysql_num_rows($gotNote) != 0) {
				$gNote = true;
			}
			//check quiz
			$gQuiz = false;
			$gotQuiz = mysql_query("SELECT * FROM `quiz` WHERE `topic_id` = $topic_id");
			if (mysql_num_rows($gotQuiz) != 0) {
				$gQuiz = true;
			}
			$rows[] = array(
				'topic_id' => $row['topic_id'],
				'module_id' => $row['module_id'],
				'le_no' => ($row['le_no'] < 10) ? "0" . $row['le_no'] : $row['le_no'],
				'name' => $row['name'],
				'description' => $row['description'],
				'note' => $gNote,
				'quiz' => $gQuiz,
				'enroll' => $gEnroll
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