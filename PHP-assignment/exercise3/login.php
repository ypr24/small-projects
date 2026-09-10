
<?php

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

$sql = "SELECT * FROM 6470exerciseusers WHERE (USERNAME='$username' AND PASSWORD_HASH='$password_hash') ";

if (mysqli_query($conn, $sql)) {
  echo "successful query  ";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

$result = mysqli_query($conn, $sql);
$count = 0;
while($row = mysqli_fetch_assoc($result)){
    print_r($row);
    $count++;
}

echo ($count == 0)?"login failed, user not found":"Welcome User, login successful";

$conn->close();

?>


<html>
<body>
<br/> Login Now <br/>

<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
Username: <input type="text" name="username"><br>
Password: <input type="password" name="password"><br>
<input type="submit">
</form>

</body>
</html>
