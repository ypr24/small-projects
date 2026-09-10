
<?php

session_start();

if($_SESSION["loggedin"] == false){
   
$servername = "localhost";
$username = "peter";
$password = "jtp12345";
$database = "6470database";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$username = $conn->real_escape_string($_POST['username']);
$password = sha1($conn->real_escape_string($_POST['password']));


$sql = "SELECT * FROM 6470exerciseusers WHERE (USERNAME='$username' AND PASSWORD_HASH='$password') ";

$result = mysqli_query($conn, $sql);

$count = $conn->affected_rows;

echo ($count == 0)?"user not found":"login successful";

echo "<br/> Cookies value : ";
    
$cookie_name = "user";    
echo $_COOKIE[$cookie_name];  

if($count == 1){
$_SESSION["loggedin"] = true;
$_SESSION["user"] = $username;
header("Refresh:0");
}


$conn->close();

$val = isset($_POST['rememberme']);

if($val == 1){

$cookie_name = "user";
$cookie_value = $username;
setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");

}


?>
<html>
<body>


<br/><br/> Remember Me !! <br/>

<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
Username: <input type="text" name="username"><br>
Password: <input type="text" name="password"><br>
remember me: <input type="checkbox" name="rememberme"><br>
<input type="submit">
</form>

<?php 
} else {
    echo "Welcome !! You are successfully logged In";
    echo "<br/> Cookies value : ";
    
    $cookie_name = "user";    
    echo $_COOKIE[$cookie_name];  

    $val = isset($_POST['logout']);
    if($val == 1) {
      session_unset();
      echo "<br/> logout called ..";

      $cookie_name = "user";
      $cookie_value = $_SESSION["user"];

      setcookie($cookie_name, $cookie_value, time() - 360,'/');

      header("Refresh:0");
        
    }

?>
<br />

<form method="post" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
<input type="submit" name="logout" value="logout" />
</form>

<?php 
}
?>
</body>
</html>
