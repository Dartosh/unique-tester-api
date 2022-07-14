<?

if (!isset($_POST['Xml']) || !$_POST['Xml']) {
    logging('Данные в ответе сервера не найдены');
    exit();
}

$_POST['Xml'] = str_replace(' ', '+', $_POST['Xml']);

$td = mcrypt_module_open (MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
mcrypt_generic_init ($td, CHECK_KEY, CHECK_KEY);
$_POST['Xml'] = mdecrypt_generic ($td, base64_decode($_POST['Xml']));

logging($_POST['Xml']);
