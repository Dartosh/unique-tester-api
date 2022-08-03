<?php

define('CHECK_KEY', 'AAAAAAAAAAAAAAAA');

$plainXml = '';

$fp = @fopen("/files/plainXml.txt", "r");

if ($fp) {
    while (($buffer = fgets($fp, 4096)) !== false) {
        $plainXml = $plainXml.$buffer;
    }
    if (!feof($fp)) {
        echo "Ошибка: fgets() неожиданно потерпел неудачу\n";
    }
    fclose($fp);
}

echo "Text: ".$plainXml;

$str_length = strlen($plainXml);
$pad_length = ($str_length % 16 == 0) ? $str_length : ($str_length +  (16 - ($str_length % 16)));
$string = str_pad($plainXml, $pad_length, "\0", STR_PAD_RIGHT);

$string = openssl_encrypt ($string, "AES-128-ECB", CHECK_KEY, (OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING));

$f = @fopen('./encodedXml.txt', 'w');
fwrite($f, $string, strlen($string));
fclose($f);