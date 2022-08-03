<?php

define('CHECK_KEY', 'AAAAAAAAAAAAAAAA');

$plainXml = file_get_contents("./files/plainXml.txt");

$str_length = strlen($plainXml);
$pad_length = ($str_length % 16 == 0) ? $str_length : ($str_length +  (16 - ($str_length % 16)));
$string = str_pad($plainXml, $pad_length, "\0", STR_PAD_RIGHT);

$string = openssl_encrypt($string, "AES-128-ECB", CHECK_KEY, (OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING));

$f = @fopen('./files/encodedXml.txt', 'w');
fwrite($f, $string, strlen($string));
fclose($f);