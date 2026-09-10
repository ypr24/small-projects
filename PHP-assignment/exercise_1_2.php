<?php
// Exercise 1

function isBitten()
{
    $r_val = rand(0,1);
    return ((1-$r_val)>=0.5)?"TRUE":"FALSE";
}

function part1(){
echo(isBitten());
}

function part2(){
echo((isBitten() == "TRUE")?"Charlie bit your finger!":"Charlie did not bite your finger!");
}

//part1();
//part2();


// Exercise 2


function countWords($string){

$token = strtok($string, " ");
$array = array();

while ($token !== false)
{
   echo "$token ";
   $tck = strtolower($token);
   $array["$tck"] += 1;
   $token = strtok(" ");
}

//print_r($array);

return $array;

}

function part3(){

$string = "Hello world Beautiful day today World";
countWords($string);

}

//part3();

?>

<html>

<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>  
<body>

<form method="GET" action="<?php echo $_SERVER[‘PHP_SELF’]; ?>" >
<input type="text" name="name">
<input type="submit">
</form>


<?php 

// part 4

function part4(){
  echo $_GET["name"]; 
}

//part4();


function part5(){

$string = countWords($_GET["name"]);

arsort($string);

echo "<br/><br/>";

echo "<table style='border 1px solid;'><tr><th>Word</th><th>Count</th></tr>";

foreach($string as $s => $s_value) {
  echo "<tr>";
  echo "<td>" . $s . "</td> <td>" . $s_value . "</td>";
  echo "</tr>";
}


echo " </table> ";


}

//$string = "Hello world Beautiful day today World";
part5();

?>



</body>
</html>
