<?php

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />

    <title><?php get_the_title() ?></title>

    <?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

<!-- Starting point for Vue root -->
<div id="app">
