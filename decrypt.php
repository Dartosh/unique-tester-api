<?php

define('CHECK_KEY', 'j1YkIs3Mf9QadPwe');

$string = file_get_contents("./files/encodedXml.txt");

$string = openssl_decrypt ($string, "AES-128-ECB", CHECK_KEY, (OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING));

$f = @fopen('./files/decodedXml.txt', 'w');
fwrite($f, $string, strlen($string));
fclose($f);


