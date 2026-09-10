
<?php

$servername = "localhost";
$username = "peter";
$password = "jtp12345";
$database = "6470database";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$username = $conn->real_escape_string($_POST['username']);
$curr_pass = sha1($conn->real_escape_string($_POST['curr_pass']));
$new_pass = sha1($conn->real_escape_string($_POST['new_pass']));

$sql = "UPDATE 6470exerciseusers SET PASSWORD_HASH='$new_pass'  WHERE (USERNAME='$username' AND PASSWORD_HASH='$curr_pass') ";

$result = mysqli_query($conn, $sql);

$count = $conn->affected_rows;

echo ($count == 0)?"update failed, user not found":"password changed successful";


$conn->close();

?>


<html>
<body>
<br/> Change password <br/>
<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
Username: <input type="text" name="username"><br>
Current Password: <input type="text" name="curr_pass"><br>
New Password: <input type="text" name="new_pass"><br>
<input type="submit">
</form>

</body>
</html>
