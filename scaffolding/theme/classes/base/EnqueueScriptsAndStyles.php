<?php

namespace ScaffoldProjectBase;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class EnqueueScriptsAndStyles
 * @package ScaffoldProjectBase
 */
class EnqueueScriptsAndStyles
{
    /**
     * @var array|string[]
     */
    private array $front_end = [
        'main',
    ];

    /**
     * @var array|string[]
     */
    private array $admin = [
        'admin',
    ];

    /**
     * EnqueueScriptsAndStyles constructor
     */
    public function __construct() {}

    /**
     * @description This load the JS for the front-end of the site
     * @add_action wp_enqueue_scripts
     *
     * @return void
     */
    public function add_scripts()
    {
        $this->enqueue_scripts($this->front_end);
    }

    /**
     * @description This load the CSS for the front-end of the site
     * @add_action wp_enqueue_scripts
     *
     * @return void
     */
    public function add_styles()
    {
        $this->enqueue_styles($this->front_end);
    }

    /**
     * @description This load the CSS for the front-end of the site
     * @add_action admin_enqueue_scripts
     *
     * @return void
     */
    public function add_admin_scripts()
    {
        $this->enqueue_scripts($this->admin);
    }

    /**
     * @description This load the CSS for the front-end of the site
     * @add_action admin_enqueue_scripts
     *
     * @return void
     */
    public function add_admin_styles()
    {
        $this->enqueue_styles($this->admin);
    }

    /**
     * @description Enqueue scripts based on array of values
     *
     * @param array $assets
     * @return void
     */
    private function enqueue_scripts(array $assets = [])
    {
        if (empty($assets)) {
            return;
        }

        // Loop and enqueue our scripts
        for ($script = 0; $script < count($assets); $script++) {
            if (isset($assets[$script])) {
                // Build our values
                $local_path = get_stylesheet_directory() . '/js/' . $assets[$script] . '.js';
                $source = get_template_directory_uri() . '/js/' . $assets[$script] . '.js';
                $handle = $assets[$script] . '-js';

                if (file_exists($local_path)) {

                    wp_enqueue_script($handle, $source, ['jquery'], filemtime($local_path), true);

                    wp_localize_script(
                        $handle,
                        'ajax_object',
                        [
                            'ajaxurl' => admin_url('admin-ajax.php'),
                            'nonce' => wp_create_nonce('ajax-nonce'),
                            'rest_nonce' => wp_create_nonce('wp_rest'),
                        ]
                    );
                }
            }
        }
    }

    /**
     * @description Enqueue styles based on array of values
     *
     * @param array $assets
     * @return void
     */
    private function enqueue_styles(array $assets = [])
    {
        if (empty($assets)) {
            return;
        }

        // Loop and enqueue our CSS
        for ($styles = 0; $styles < count($assets); $styles++) {
            if (isset($assets[$styles])) {
                // Build our values
                $local_path = get_stylesheet_directory() . '/css/' . $assets[$styles] . '.css';
                $source = get_template_directory_uri() . '/css/' . $assets[$styles] . '.css';
                $handle = $assets[$styles] . '-css';

                if (file_exists($local_path)) {
                    wp_enqueue_style($handle, $source, [], filemtime($local_path));
                }
            }
        }
    }
}
