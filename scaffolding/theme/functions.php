<?php

define('THEME_NAME_THEME_DIR', get_stylesheet_directory());

const THEME_NAME_DOMAIN = 'THEME_VALUE';

if (file_exists(THEME_NAME_THEME_DIR . 'vendor/autoload.php')) {
    require_once(THEME_NAME_THEME_DIR . 'vendor/autoload.php');
}
