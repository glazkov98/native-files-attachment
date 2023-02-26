<?php

if (isset($_POST['send'])) {
	header('Content-type: application/json');
	echo json_encode($_FILES, JSON_UNESCAPED_UNICODE);
}