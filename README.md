# WordPress Scaffold CLI

### Create WordPress Project (apache, hosts)
@todo maybe create command for this?

#### DB Setup 
```shell
$ sudo mysql
$ CREATE DATABASE databasename;
$ GRANT ALL PRIVILEGES ON databasename.* TO "wordpressusername"@"hostname" IDENTIFIED BY "password";
$ FLUSH PRIVILEGES;
$ EXIT;
```

#### Project Setup

```shell
$ mkdir YOUR_PROJECT_NAME
$ cd YOUR_PROJECT_NAME
$ npm run ws-scaffold-project-init
$ wp core install --url=SITE_URL --title=SITE_TITLE --admin_user=ADMIN_USER --admin_password=ADMIN_PASSWORD --admin_email=ADMIN_EMAIL
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
  
### Development
* Mention .env creation

### Resources
* https://wordpress.org/support/article/creating-database-for-wordpress/
* https://wp-cli.org/
* https://getcomposer.org/doc/
* https://vuejs.org/
* https://sass-lang.com/
