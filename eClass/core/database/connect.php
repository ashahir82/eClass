<?php
$connect_error ='Harap maaf, laman ini mengalami masalah sambungan pangkalan data.';
mysql_connect('localhost','root','d33d@t82') or die($connect_error);
mysql_select_db('eclass') or die($connect_error);
?>