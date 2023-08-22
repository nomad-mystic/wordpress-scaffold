<?php
/**
  Plugin Name: SCAFFOLD_NAME
  Description: SCAFFOLD_DESCRIPTION
  Version: 1.0
*/

// Plugin specific constants
define('CAPS_AND_SNAKE_NAME_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CAPS_AND_SNAKE_NAME_THEME_DIR', get_stylesheet_directory());

const CAPS_AND_SNAKE_NAME_TEXT_DOMAIN = 'SCAFFOLD_NAME';

if (file_exists(CAPS_AND_SNAKE_NAME_PLUGIN_DIR . 'vendor/autoload.php')) {
    require_once(CAPS_AND_SNAKE_NAME_PLUGIN_DIR . 'vendor/autoload.php');
}

