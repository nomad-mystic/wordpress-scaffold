# WordPress Scaffold CLI

# Installation 
`$ npm i -g @nomadmystic/wordpress-scaffold-cli`

    NOTE: This packages uses node version >=18.x

## Commands

##### Help:
```shell
$ wps --help
```

##### Initialize Project
```shell 
$ wps --pi
$ wps --project-init
```

Uses the WP-CLI to download the core files, creates the config needed for DB if specified, scaffolds internal files/folders,
generates/updates JSON configs, adds common development files, installs the core DB and admin user, 
and initializes a git repo if not one already.

* User Prompts:
  * `Project Name (String)`, Namespace of your WordPress site, used in namespacing PHP classes
  * `Database Setup (Boolean)`, Asks if you have setup a local DB for the site (NOTE: WILL OVERWRITE DB at the moment)
    * `Database Name (String)`, DB name
    * `Database Password (String)`, DB password
    * `Database Username (String)`, DB Username
  * `Site Title (String)`, Used in `wp core install` command
  * `Site Admin User (String)`, Admin user for the site
  * `Admin Email (String)`, Admin email
  * `Site Admin Password (String)`, Admin password for the site 
  * `Site Url (String)`, Production URL for your site
  * `Dev Site Url (String)`, Development URL for your site

`$ ws-scaffold-plugin` (Future Release)

##### Initialize Theme
```shell 
$ wps --t
$ wps --theme
```

* User Prompts: 
  * `Project Name (String)`, Namespace of your WordPress site, used in namespacing PHP classes
  * `Theme Name (String)`, Name of your theme
  * `Theme Description (String)`, Description for your theme
  * `FrontEnd Framework (Array['None', 'Vue.js 3'])`, Choose if you want Vue.js added to your project
  * `Site Url (String)`, Production URL for your site
  * `Dev Site Url (String)`, Development URL for your site

### Bootstrap Class and hook reflection

In both the plugin and theme scaffolding I include a BootstrapClasses class which auto 
instantiates classes it finds in the composer.json psr-4 namespaces object.

This uses reflection to hook directly into the WordPress hook system. 

#### Doc Properties:
```PHP
@add_action 
@add_filter
@priority (optional, defaults to 10)
```

#### Examples: 
##### Filter:
```PHP
/**
 * @description This filters the content
 * @add_filter the_content 
 * 
 * @param string $content
 * @return string
 */
public function some_filter_method(string $content): string
{
    // Do something with content
    
    return $content;
}
```

##### Action:
```PHP
/**
 * @description This enqueues scripts
 * @add_action wp_enqueue_scripts
 * 
 * @return void
 */
public function some_action_method(): void
{
    // Enqueue some scripts
}
```

##### Action with Priority:
```PHP
/**
 * @description This enqueues scripts
 * @add_action wp_enqueue_scripts
 * @priority 100
 * 
 * @return void
 */
public function some_action_method(): void
{
    // Enqueue some scripts
}
```

## Setup
### Create WordPress Project
    User will need to take care of setting up hosts and DNS. Not going to scaffold this because of 
    varying local setups. i.e. apache/Nginx bare-metal, Docker e.t.c

#### DB Setup 
```shell
$ sudo mysql
$ CREATE DATABASE <DATABSE_NAME>;
$ GRANT ALL PRIVILEGES ON <DATABSE_NAME>.* TO "<DATABASE_USER>"@"localhost" IDENTIFIED BY "<DATABASE_PASSWORD>";
$ FLUSH PRIVILEGES;
$ EXIT;
```

#### Project Setup

```shell
$ mkdir <YOUR_PROJECT_NAME>
$ cd <YOUR_PROJECT_NAME>
$ wps --project-init
```

#### Theme Setup
```shell
$ cd <YOUR_PROJECT_NAME>
$ wps --theme
```

## Development
#### Initial Setup
```shell
$ git clone git@github.com:nomad-mystic/wordpress-scaffold-cli.git ./scaffold-cli
$ cd scaffold-cli
$ nvm use
$ npm i
$ npm run dev:tsc
```

#### Local Testing
```shell
$ npm pack ./ --pack-destination="<PATH_TO_FOLDER>"
$ cd <PATH_TO_FOLDER>
$ npm i -g <PACKAGE_NAME>
$ cd <YOUR_PROJECT_NAME>
$ wps --help
$ wps --version
```

> For testing this package in a non-WordPress root folder copy ./env.example to ./.env and update values

### Resources
* https://wordpress.org/support/article/creating-database-for-wordpress/
* https://wp-cli.org/
* https://getcomposer.org/doc/
* https://vuejs.org/
* https://sass-lang.com/
* https://webpack.js.org/
* https://github.com/nvm-sh/nvm
