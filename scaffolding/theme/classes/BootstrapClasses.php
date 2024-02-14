<?php

namespace PASCAL_NAME;

use ReflectionClass;
use ReflectionException;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class BootstrapClasses
 * @package PASCAL_NAME
 */
class BootstrapClasses
{
    private array $no_instantiate = [
        'BootstrapClasses',
    ];

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
            add_action('admin_notices', function () {
                printf('<div class="notice notice-error"><p>Warning: %s</p></div>',
                    'Composer.json missing from the project, please add!');
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
    private function get_composer_classes(string|false $composer_file): array
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
            if (empty($composer_classes[$namespace]) ||
                !isset($composer_classes[$namespace]->namespace) ||
                empty($composer_classes[$namespace]->namespace) ||
                !isset($composer_classes[$namespace]->classes) ||
                empty($composer_classes[$namespace]->classes)
            ) {
                continue;
            }

            // For each of the classes check if we have hooks and build
            for ($class = 0; $class < count($composer_classes[$namespace]->classes); $class++) {
                // Store our current needed variables
                $class_filename = basename($composer_classes[$namespace]->classes[$class], '.php');
                $current_namespace = $composer_classes[$namespace]->namespace;

                // Name sure things don't blow up here
                if (class_exists($current_namespace . "\\" . $class_filename)) {

                    // Don't call this over and over again, no need to create an infinite loop here
                    if (in_array($class_filename, $this->no_instantiate)) {
                        $this->instantiate_class($current_namespace . "\\" . $class_filename);
                    }
                }
            } // End for
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
        //Instantiate the reflection object
        $reflector = new ReflectionClass($namespace_and_class);

        // If the object is not instantiationable exit
        if (!$reflector->isInstantiable()) {
            return;
        }

        // Instantiate the object
        $classname_string = $namespace_and_class;
        $class = new $classname_string();

        $methods = $reflector->getMethods();

        // Sanity check and bail early if there aren't any methods
        if (empty($methods)) {
            return;
        }

        foreach ($methods as $method) {
            // Bail early
            if (empty($method)) {
                continue;
            }

            $method_name = $method->getName();

            $matches = $this->check_for_matches($reflector, $method_name);

            // Make sure we have match with @ in the docBlock
            if (!empty($matches[0]) && is_array($matches[0])) {

                $this->build_hooks($class, $method_name, $matches[0]);

            } // End sanity check
        } // End foreach $methods
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

    /**
     * @description Check for DocBlock properties i.e. @
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param object $reflector
     * @param string $method_name
     * @return array
     */
    private function check_for_matches(object $reflector, string $method_name): array
    {
        // Get method docBlocks string
        $doc_blocks = $reflector->getMethod($method_name)->getdoccomment();

        // Define the regular expression pattern to use for string matching (Checking for @ in docBlock)
        $pattern = "#(@[a-zA-Z]+\s*[a-zA-Z0-9].*)#im";
        $matches = [];

        // Perform the regular expression on the string provided
        preg_match_all($pattern, $doc_blocks, $matches, PREG_PATTERN_ORDER);

        return $matches;
    }

    /**
     * @description Pass this the class information we need and hook into WordPress if DocBlock has hook information
     * @private
     * @author Keith Murphy | nomadmystics@gmail.com
     *
     * @param object $class
     * @param string $method_name
     * @param array $matches
     * @return void
     */
    private function build_hooks(object $class, string $method_name, array $matches): void
    {
        // We need to check for priority in the doc blocks first then apply theme to the action or filter
        $priority = 10;
        $priority_value = $this->check_for_property('@priority', $matches);

        if (!empty($priority_value)) {
            $priority_level = preg_split("/[\s,]+/", $priority_value);

            $priority = (int) $priority_level[1];
        }

        // Check for our desired properties
        foreach ($matches as $block_property) {
            if (!empty($block_property)) {
                // Check for filter or action
                preg_match('/@add_action*(.*)$/im', $block_property, $action_found);
                preg_match('/@add_filter*(.*)$/im', $block_property, $filter_found);

                // Here we go
                if (!empty($action_found)) {
                    // Grab the hook name
                    $action = trim($action_found[1]);

                    // Do the action
                    add_action($action, [$class, $method_name], $priority);
                }

                // Here we go
                if (!empty($filter_found)) {
                    // Grab the hook name
                    $filter = trim($filter_found[1]);

                    // Do the filter
                    add_filter($filter, [$class, $method_name], $priority);
                }
            } // End sanity $block_property
        } // End foreach $block_property
    }
}

if (class_exists('PASCAL_NAME\BootstrapClasses')) {
    new BootstrapClasses();
}
