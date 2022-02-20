<?php
/**
  Plugin Name: PLUGIN_NAME
  Description: PLUGIN_DESCRIPTION
  Version: 1.0
  Author: PLUGIN_AUTHOR
*/

// @todo Get plugin name and build constants

// Plugin specific constants
define('PLUGIN_NAME_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PLUGIN_NAME_THEME_DIR', get_stylesheet_directory());

const PLUGIN_NAME_TEXT_DOMAIN = 'PLUGIN_NAME';

require_once(PLUGIN_NAME_PLUGIN_DIR . 'vendor/autoload.php');
