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


function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$username = $conn->real_escape_string($_POST['username']);
$phone = $conn->real_escape_string($_POST['phone']);

$sql = "SELECT * FROM 6470exerciseusers WHERE (USERNAME='$username' AND PHONE='$phone') ";

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

echo ($count == 0)?"user not found":"user found ";

if($count == 1){
    echo "<br/> user matched, generating the random password ";
    echo generateRandomString(15);
}else{
    echo "user not found";
}

$conn->close();

?>


<html>
<body>

<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
Username: <input type="text" name="username"><br>
Phone: <input type="text" name="phone"><br>
<input type="submit">
</form>

</body>
</html>
