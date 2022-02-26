<?php

define('THEME_NAME_THEME_DIR', get_stylesheet_directory());

// Get out theme config
$project_config = file_get_contents(ABSPATH . 'internal/project/project-config.json');

// Extract values from config
$active_theme = 'scaffold-theme';

if (empty($project_config)) {
    // Let the user know there was an issue with a WordPress alert!!!
    exit;
} else {

    // Build our values
    $project_config = json_decode($project_config);

    $active_theme = $project_config->{'active-theme'};
}

/**
 * Load Composer
 */
if (file_exists(ABSPATH . 'vendor/autoload.php')) {
    require_once(ABSPATH . 'vendor/autoload.php');
}

/**
 * Starting point for all auto initializing
 */
if (file_exists(ABSPATH . "wp-content/themes/{$active_theme}/classes/BootstrapClasses.php")) {
    require_once(ABSPATH . "wp-content/themes/{$active_theme}/classes/BootstrapClasses.php");
}

// Build our constants
define('THEME_NAME_DOMAIN', $active_theme);
