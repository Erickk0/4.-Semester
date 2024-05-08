<?php
/**
 * Script to test forms
 *
 * PHP version 5.6
 *
 * @category None
 * @package  None
 * @author   Ludger Martin <ludger.martin@hs-rm.de>
 * @license  Apache License 2.0 http://www.apache.org/licenses/LICENSE-2.0
 * @version  1.0 
 * @link     none
 */
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Form</title>
</head>
<body>
<h1>Form</h1>  
<?php
if (count($_GET)) {
    echo "<h2>GET</h2>";
    var_dump($_GET);
}
if (count($_POST)) {
    echo "<h2>POST</h2>";
    var_dump($_POST);
}
if (count($_FILES)) {
    echo "<h2>FILES</h2>";
    var_dump($_FILES);
}
?>
</body>
</html>
