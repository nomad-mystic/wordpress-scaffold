<?php

namespace ScaffoldProject;

use ReflectionClass;
use ReflectionException;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class BootstrapClasses
 * @package ScaffoldProject
 */
class BootstrapClasses
{
    /**
     * @description Auto initialize with JSON
     * @throws ReflectionException
     *
     * @return void
     */
    public function __construct()
    {
        // Get out theme config
        $theme_config = $this->get_config_file('theme/class-list.json');

        if (empty($theme_config)) {
            // Let the user know there was an issue with a WordPress alert!!!
            exit;
        }

        // Get our classes and namespaces from the config file
        for ($namespace = 0; $namespace < count($theme_config); $namespace++) {
            // Sanity check
            if (isset($theme_config[$namespace]) && !empty($theme_config[$namespace])) {

                // For each of the classes check if we have hooks and build
                if (isset($theme_config[$namespace]->namespace) &&
                    !empty($theme_config[$namespace]->namespace) &&
                    isset($theme_config[$namespace]->classes) &&
                    !empty($theme_config[$namespace]->classes)
                ) {

                    for ($class = 0; $class < count($theme_config[$namespace]->classes); $class++) {

                        // Name sure things don't blow up here
                        if (class_exists($theme_config[$namespace]->namespace . "\\" . $theme_config[$namespace]->classes[$class])) {
                            // var_dump($theme_config[$namespace]->namespace);
                            // var_dump($theme_config[$namespace]->classes[$class]);

                            $this->instantiate_class($theme_config[$namespace]->namespace . "\\" .$theme_config[$namespace]->classes[$class]);
                        }

                    } // End for

                } // End if
            } // End if
        } // End for
    }

    /**
     * @description Grab a config
     *
     * @param string $config_file
     * @return array|mixed
     */
    private function get_config_file(string $config_file)
    {
        $raw_file = file_get_contents(ABSPATH . 'internal/' . $config_file);

        if (!$raw_file) {
            return [];
        }

        return json_decode($raw_file);
    }

    /**
     * @description Bases on our config instantiate our classes and hooks here
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
        //  var_dump($methods);

        // Sanity check and bail early if there aren't any methods
        if (is_array($methods) && !empty($methods)) {

            foreach ($methods as $method) {
                if (isset($method) && !empty($method)) {
                    //  var_dump($method->getName());
                    $method_name = $method->getName();

                    // Get method docBlocks string
                    $doc_blocks = $reflector->getMethod($method_name)->getdoccomment();

                    // Define the regular expression pattern to use for string matching
                    $pattern = "#(@[a-zA-Z]+\s*[a-zA-Z0-9, ()_].*)#";
                    $matches = null;

                    // Perform the regular expression on the string provided
                    preg_match_all($pattern, $doc_blocks, $matches, PREG_PATTERN_ORDER);

                    // Make sure we have match with @ in the docBlock
                    if (isset($matches[0]) && !empty($matches[0])) {
                        // Check for our desired properties
                        foreach ($matches[0] as $block_property) {
                            if (isset($block_property) && !empty($block_property)) {
                                $priority = 10;

                                // Check for filter or action
                                preg_match('/@add_action/', $block_property, $action_found);
                                preg_match('/@add_filter/', $block_property, $filter_found);
                                preg_match('/@priority/', $block_property, $priority_found);

//                                if (isset($priority_found) && !empty($priority_found)) {
//
//                                }

                                // Here we go
                                if (isset($action_found) && !empty($action_found)) {

                                    // Grab the hook name
                                    $actions_name = preg_split("/[\s,]+/", $block_property);

                                    // Do the action
                                    add_action($actions_name[1], [$class, $method_name], $priority);
                                }

                                // Here we go
                                if (isset($filter_found) && !empty($filter_found)) {
                                    // Grab the hook name
                                    $filter_name = preg_split("/[\s,]+/", $block_property);

                                    // Do the filter
                                    add_filter($filter_name[1], [$class, $method_name], $priority);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

new BootstrapClasses();
