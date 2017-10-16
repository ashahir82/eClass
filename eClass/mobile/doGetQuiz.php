<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id'])) {
	$topic_id=sanitize($_GET['topic_id']);
	$rows = array();
	$answer = array();
	
	//count note
	$result = mysql_query("SELECT * FROM `quiz` WHERE `topic_id` = $topic_id");
	if (mysql_num_rows($result) != 0) {
		// output data of each row
		while ($row = mysql_fetch_array($result)) {
			$rows[] = array(
				'quiz_id' => $row['quiz_id'],
				'topic_id' => $row['topic_id'],
				'text' => $row['question'],
				'answers' => array(array('answer' => $row['option0'], 'correct' => ($row['answer'] == 0) ? true : false), array('answer' => $row['option1'], 'correct' => ($row['answer'] == 1) ? true : false), array('answer' => $row['option2'], 'correct' => ($row['answer'] == 2) ? true : false), array('answer' => $row['option3'], 'correct' => ($row['answer'] == 3) ? true : false)),
				'selected' => null,
				'correct' => null
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