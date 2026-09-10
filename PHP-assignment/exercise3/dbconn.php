<?php

$servername = "localhost";
$username = "peter";
$password = "jtp12345";

// Create connection
$conn = new mysqli($servername, $username, $password);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE 6470database";
if ($conn->query($sql) === TRUE) {
  echo "Database 6470database created successfully";
} else {
  echo "Error creating database: " . $conn->error;
}

// Creating the schema
$database = "6470database";
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// sql to create table
$sql = "CREATE TABLE 6470exerciseusers (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
USERNAME VARCHAR(100) UNIQUE,
PASSWORD_HASH CHAR(40),
PHONE VARCHAR(10),
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
  echo "Table 6470exerciseusers created successfully";
} else {
  echo "Error creating table: " . $conn->error;
}

echo "<br/>";

$conn->close();
?>
