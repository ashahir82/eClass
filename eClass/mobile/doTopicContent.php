<?php
header("Access-Control-Allow-Origin: *");//to allow cross-site

include '../core/init.php';


if(isset($_POST['topic_id'])) {
	$topic_id=sanitize($_POST['topic_id']);
	
	echo '<ul data-role="listview" data-inset="true">';
	
	//count note
	$notecount = mysql_query("SELECT * FROM `note` WHERE `topic_id` = $topic_id");
	$total_notes = mysql_num_rows($notecount);
	if ($total_notes != 0) {
		// output data of each row
		echo '<li><a href="note.html?tid=' . $topic_id . '" data-ajax="false">Nota <span class="ui-li-count">' . $total_notes . ' Halaman</span></a></li>';
	} else {
		echo '<li><a href="#">Nota <span class="ui-li-count">' . $total_notes . ' Halaman</span></a></li>';
	}
	
	//count soalan
	$quizcount = mysql_query("SELECT * FROM `quiz` WHERE `topic_id` = $topic_id");
	$total_quizs = mysql_num_rows($quizcount);
	if ($total_quizs != 0) {
		// output data of each row
		echo '<li><a href="quiz.html?tid=' . $topic_id . '" data-ajax="false">Soalan <span class="ui-li-count">' . $total_quizs . ' Soalan</span></a></li>';
	} else {
		echo '<li><a href="#">Soalan <span class="ui-li-count">' . $total_quizs . ' Soalan</span></a></li>';
	}
	
	//count recources
	$quizcount = mysql_query("SELECT * FROM `quiz` WHERE `topic_id` = $topic_id");
	$total_quizs = mysql_num_rows($quizcount);
	if ($total_quizs != 0) {
		// output data of each row
		echo '<li><a href="quiz.html?tid=' . $topic_id . '" data-ajax="false">Bahan Rujukan <span class="ui-li-count">' . $total_quizs . ' Item</span></a></li>';
	} else {
		echo '<li><a href="#">Soalan <span class="ui-li-count">' . $total_quizs . ' Soalan</span></a></li>';
	}
	
	echo '</ul>';
	echo '<a class="selectTopic" id="' . topic_module($topic_id) . '" href="#" data-role="button" role="button" data-ajax="false">Back</a>';
}
?>