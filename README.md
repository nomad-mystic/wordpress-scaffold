# WordPress Scaffold CLI

# Installation 
`$ npm i -g @nomadmystic/wordpress-scaffold-cli`

    NOTE: This packages uses node version 16.x

## Commands
`$ ws-scaffold-project-init`

Uses the WP-CLI to download the core files, 
creates the config needed for DB if specified, scaffolds internal files/folders,
generates/updates JSON configs, adds common development files, installs the core DB and admin user, 
and initializes a git repo if not one already.

`$ ws-scaffold-plugin` (Future Release)

`$ ws-scaffold-theme` (Testing)

`$ ws-scaffold-plugin-add` (Future Release)

`$ ws-scaffold-theme-add` (Future Release)

## Setup
### Create WordPress Project (apache, hosts)
@todo maybe create command for this?

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

### Scaffold todos 
* Create constants 
* Create inputs
* Mention manual config updates
* Add class creation 
* Update WebPack, maybe vanilla JS, Vue, React configs?
* Variables 
  * Theme
    * Theme name
    * NameSpaces for classes 
    * name for npm 
    * name for composer
* Theme
  * Update screenshot 
  * Update favicon.ico? 
* Classes
  * Initialize with JSON config (theme-root/config)
  * Add base on init and append while adding classes
  * PROJECT_NAME for composer and JSON config (PascalCase)
* NPM does not publish .gitignore fix this when you generate
  
### Development
* Mention .env creation

### Resources
* https://wordpress.org/support/article/creating-database-for-wordpress/
* https://wp-cli.org/
* https://getcomposer.org/doc/
* https://vuejs.org/
* https://sass-lang.com/
