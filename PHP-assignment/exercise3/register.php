<?php 

require('dbconn.php');

$servername = "localhost";
$username = "peter";
$password = "jtp12345";
$database = "6470database";

 // Create connection
$conn = new mysqli($servername, $username, $password, $database);
 // Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$username = $conn->real_escape_string($_POST['username']);
$password_hash = sha1($conn->real_escape_string($_POST['password']));
$phone = $conn->real_escape_string($_POST['phone']);


$sql = "INSERT INTO 6470exerciseusers (USERNAME, PASSWORD_HASH, PHONE)
VALUES ('$username', '$password_hash', '$phone')";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

$conn->close();

?>

<html>
<body>
 
<br/> Register Now <br/>
<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
Username: <input type="text" name="username"><br>
Password: <input type="password" name="password"><br>
Phone: <input type="number" name="phone"><br>
<input type="submit">
</form>

</body>
</html>
