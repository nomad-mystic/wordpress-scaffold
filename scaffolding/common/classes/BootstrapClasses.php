<?php

namespace PASCAL_NAME;

use ReflectionClass;
use ReflectionException;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class BootstrapClasses
 * @package KeithTesting1
 */
class BootstrapClasses
{
    /**
     * @description Auto initialize classes from composer namespaces
     * @author Keith Murphy | nomadmystics@gmail.com
     * @throws ReflectionException
     *
     * @return void
     */
    public function __construct()
    {
        $composer_file = file_get_contents(ABSPATH . 'composer.json');

        // Let the user know there was an issue with a WordPress alert!!!
        if (empty($composer_file)) {
            add_action( 'admin_notices', function() {
                printf( '<div class="notice notice-error"><p>Warning: %s</p></div>', 'Composer.json missing from the project, please add!');
            });

            return;
        }

        $composer_classes = $this->get_composer_classes($composer_file);

        if (!empty($composer_classes)) {
            $this->perform_bootstrap($composer_classes);
        }
    }

    /**
     * @description Extract our Composer's psr-4 auto classes
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param string|false $composer_file
     * @return array
     */
    private function get_composer_classes(string | false $composer_file): array
    {
        $classes = [];
        $count = 0;

        // Sanity check we have a composer.json
        if (!$composer_file) {
            return [];
        }

        $composer_object = json_decode($composer_file);

        // Sanity check we have composer class namespaces
        if (empty($composer_object->autoload->{'psr-4'})) {
            return [];
        }

        // Extract namespaces
        $composer_namespace = $composer_object->autoload->{'psr-4'};

        foreach ($composer_namespace as $namespace => $value) {
            // Sanity check we are looping over a directory
            if (!empty($namespace) && !empty($value[0]) && is_dir(ABSPATH . $value[0])) {
                $namespace_slash_removed = rtrim($namespace, "\\");

                // Extract
                $files = glob(ABSPATH . $value[0] . "/*.{php}", GLOB_BRACE);

                if (!empty($files) && is_array($files)) {
                    $classes[$count] = (object) [
                        'namespace' => $namespace_slash_removed,
                        'classes' => $files,
                    ];

                    $count++;
                }
            }
        }

        return $classes;
    }

    /**
     * @description Based on the classes we extracted from composer.json build our refection classes
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @throws ReflectionException
     *
     * @param array $composer_classes
     * @return void
     */
    private function perform_bootstrap(array $composer_classes): void
    {
        // Get our classes and namespaces from the composer extraction
        for ($namespace = 0; $namespace < count($composer_classes); $namespace++) {
            // Sanity check
            if (!empty($composer_classes[$namespace])) {

                // For each of the classes check if we have hooks and build
                if (isset($composer_classes[$namespace]->namespace) &&
                    !empty($composer_classes[$namespace]->namespace) &&
                    isset($composer_classes[$namespace]->classes) &&
                    !empty($composer_classes[$namespace]->classes)
                ) {
                    for ($class = 0; $class < count($composer_classes[$namespace]->classes); $class++) {
                        // Store our current needed variables
                        $class_filename =  basename($composer_classes[$namespace]->classes[$class], '.php');
                        $current_namespace = $composer_classes[$namespace]->namespace;

                        // Name sure things don't blow up here
                        if (class_exists($current_namespace . "\\" . $class_filename)) {

                            // Don't call this over and over again, no need to create an infinite loop here
                            if ($class_filename !== 'BootstrapClasses') {

                                $this->instantiate_class($current_namespace . "\\" . $class_filename);

                            }
                        }

                    } // End for
                } // End if
            } // End if
        } // End for
    }

    /**
     * @description Bases on our config instantiate our classes and hooks here
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     * @throws ReflectionException
     *
     * @param string $namespace_and_class
     * @return void
     */
    private function instantiate_class(string $namespace_and_class): void
    {
        // Instantiate the object
        $classname_string = $namespace_and_class;
        $class = new $classname_string();

        //Instantiate the reflection object
        $reflector = new ReflectionClass($namespace_and_class);

        $methods = $reflector->getMethods();

        // Sanity check and bail early if there aren't any methods
        if (!empty($methods)) {

            foreach ($methods as $method) {
                if (!empty($method)) {
                    $method_name = $method->getName();

                    // Get method docBlocks string
                    $doc_blocks = $reflector->getMethod($method_name)->getdoccomment();

                    // Define the regular expression pattern to use for string matching (Checking for @ in docBlock)
                    $pattern = "#(@[a-zA-Z]+\s*[a-zA-Z0-9, ()_].*)#";
                    $matches = null;

                    // Perform the regular expression on the string provided
                    preg_match_all($pattern, $doc_blocks, $matches, PREG_PATTERN_ORDER);

                    // Make sure we have match with @ in the docBlock
                    if (!empty($matches[0]) && is_array($matches[0])) {

                        // We need to check for priority in the doc blocks first then apply theme to the action or filter
                        $priority = 10;
                        $priority_value = $this->check_for_property('@priority', $matches[0]);

                        if (!empty($priority_value)) {
                            $priority_level = preg_split("/[\s,]+/", $priority_value);

                            $priority = (int) $priority_level[1];
                        }

                        // Check for our desired properties
                        foreach ($matches[0] as $block_property) {
                            if (!empty($block_property)) {
                                // Check for filter or action
                                preg_match('/@add_action*(.*)$/m', $block_property, $action_found);
                                preg_match('/@add_filter*(.*)$/m', $block_property, $filter_found);

                                // Here we go
                                if(!empty($action_found)) {
                                    // Grab the hook name
                                    $action = trim($action_found[1], ' ');

                                    // Do the action
                                    add_action($action, [$class, $method_name], $priority);
                                }

                                // Here we go
                                if(!empty($filter_found)) {
                                    // Grab the hook name
                                    $filter = trim($filter_found[1], ' ');

                                    // Do the filter
                                    add_filter($filter, [$class, $method_name], $priority);
                                }
                            } // End sanity $block_property
                        } // End foreach $block_property
                    } // End sanity check
                } // End sanity check
            } // End foreach $methods
        } // End $methods
    } // End Method

    /**
     * @description array_search with partial matches
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param string $needle
     * @param $haystack
     * @return bool|string
     */
    private function check_for_property(string $needle, $haystack): bool | string
    {
        foreach ($haystack as $key => $item) {
            if (isset($item) && str_contains($item, $needle)) {
                return $item;
            }
        }

        return false;
    }
}

if (class_exists('PASCAL_NAME\BootstrapClasses')) {
    new BootstrapClasses();
}
