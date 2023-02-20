<?php
function digits_of($n) {
    return str_split((string)$n);
}

function luhn_checksum($card_number) {
    $digits = digits_of($card_number);
    $odd_digits = array_reverse(array_slice($digits, 0, -1, 2));
    $even_digits = array_reverse(array_slice($digits, 1, -1, 2));
    $checksum = array_sum($odd_digits);
    foreach ($even_digits as $digit) {
        $checksum += array_sum(digits_of($digit*2));
    }
    return $checksum % 10;
}

function calculate_luhn($partial_card_number) {
    $check_digit = luhn_checksum($partial_card_number . '0');
    return $check_digit === 0 ? 0 : 10 - $check_digit;
}

function generate_random_string($bin="", $month="", $year="", $cvv="") {
    $bin_length = 15;
    if (strlen($bin) < $bin_length) {
        for ($i = strlen($bin); $i < $bin_length; $i++) {
            $bin .= strval(rand(0, 9));
        }
    }
    $separator_1 = "|";
    if ($month === "") {
        $month = str_pad(strval(rand(1, 12)), 2, "0", STR_PAD_LEFT);
    }
    $separator_2 = "|";
    if ($year === "") {
        $year = strval(rand(2023, 2031));
    }
    $separator_3 = "|";
    if ($cvv === "") {
        $cvv = str_pad(strval(rand(0, 999)), 3, "0", STR_PAD_LEFT);
    }
    $check_digit = calculate_luhn($bin);
    $bin .= strval($check_digit);
    return $bin . $separator_1 . $month . $separator_2 . $year . $separator_3 . $cvv;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $num_of_strings = intval($_POST['num_of_strings']);
    $bin = isset($_POST['bin']) ? $_POST['bin'] : "";
    $month = isset($_POST['month']) ? $_POST['month'] : "";
    $year = isset($_POST['year']) ? $_POST['year'] : "";
    $cvv = isset($_POST['cvv']) ? $_POST['cvv'] : "";

    $generated_strings = array();
    for ($i = 0; $i < $num_of_strings; $i++) {
        $generated_strings[] = generate_random_string($bin, $month, $year, $cvv);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
	<title>Credit Card Generator</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<h1>Credit Card Generator</h1>
	<form method="post" action="">
		<label>Number of Card Numbers:</label>
		<input type="text" name="number_of_strings" value="<?php echo isset($_POST['number_of_strings']) ? $_POST['number_of_strings'] : '' ?>" required>
		<label>Bin:</label>
		<input type="text" name="bin" value="<?php echo isset($_POST['bin']) ? $_POST['bin'] : '' ?>">
		<label>Month:</label>
		<input type="text" name="month" value="<?php echo isset($_POST['month']) ? $_POST['month'] : '' ?>">
		<label>Year:</label>
		<input type="text" name="year" value="<?php echo isset($_POST['year']) ? $_POST['year'] : '' ?>">
		<label>CVV:</label>
		<input type="text" name="cvv" value="<?php echo isset($_POST['cvv']) ? $_POST['cvv'] : '' ?>">
		<button type="submit">Generate Card Numbers</button>
	</form>
