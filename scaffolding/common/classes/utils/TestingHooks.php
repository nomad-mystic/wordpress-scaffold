<?php

namespace PASCAL_NAMEUtils;

class TestingHooks
{
    /**
     * @description Example of reflection
     *
     * @add_filter the_content
     * @priority 100
     *
     * @param string $the_content
     * @return string
     */
    public function testing_the_content(string $the_content): string
    {

        $testing_content = $the_content . ' Here we are!';

        return $testing_content;

    }
}
