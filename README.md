# WordPress Scaffold CLI

# Installation 
`$ npm i -g @nomadmystic/wordpress-scaffold-cli`

    NOTE: This packages uses node version 18.x

## Commands
`$ ws-scaffold-project-init`

Uses the WP-CLI to download the core files, 
creates the config needed for DB if specified, scaffolds internal files/folders,
generates/updates JSON configs, adds common development files, installs the core DB and admin user, 
and initializes a git repo if not one already.

`$ ws-scaffold-plugin` (Future Release)

`$ ws-scaffold-theme` (Building features)

`$ ws-scaffold-plugin-add` (Future Release)

`$ ws-scaffold-theme-add` (Future Release)

`$ ws-scaffold-heal` (Future Release)

`$ ws-scaffold-eject` (Future Release)

### Bootstrap Class and hook reflection

In both the plugin and theme scaffolding I include a BootstrapClasses class which auto 
instantiates classes it finds in the class-list.json files.

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
$ CREATE DATABASE databasename;
$ GRANT ALL PRIVILEGES ON databasename.* TO "wordpressusername"@"localhost" IDENTIFIED BY "password";
$ FLUSH PRIVILEGES;
$ EXIT;
```

#### Project Setup

```shell
$ mkdir YOUR_PROJECT_NAME
$ cd YOUR_PROJECT_NAME
$ ws-scaffold-project-init
```

#### Theme Setup
```shell
$ cd YOUR_PROJECT_NAME
$ ws-scaffold-theme
```

### Scaffold todos
* Mention manual config updates
* Add class creation
* Theme
  * Add includes autoload
* Classes
  * Add base on init and append while adding classes
  
### Development
* Mention .env creation

### Resources
* https://wordpress.org/support/article/creating-database-for-wordpress/
* https://wp-cli.org/
* https://getcomposer.org/doc/
* https://vuejs.org/
* https://sass-lang.com/
* https://webpack.js.org/
* https://github.com/nvm-sh/nvm
