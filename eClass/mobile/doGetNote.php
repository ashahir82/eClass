<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_GET['topic_id'])) {
	$topic_id=sanitize($_GET['topic_id']);
	$rows = array();
	
	//count note
	$result = mysql_query("SELECT * FROM `note` WHERE `topic_id` = $topic_id ORDER BY `page`");
	if (mysql_num_rows($result) != 0) {
		// output data of each row
		while ($row = mysql_fetch_array($result)) {
			$rows[] = array(
				'note_id' => $row['note_id'],
				'topic_id' => $row['topic_id'],
				'page' => $row['page'],
				'title' => $row['title'],
				'content' => $row['content']
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