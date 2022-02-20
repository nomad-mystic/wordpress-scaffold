# WordPress Scaffold CLI

### Create WordPress Project
```shell
$ mkdir YOUR_PROJECT_NAME
$ cd YOUR_PROJECT_NAME
$ wp core download
$ mv ./wp-config-sample.php ./wp-config.php
$ wp core install --url=SITE_URL --title=SITE_TITLE --admin_user=ADMIN_USER --admin_password=ADMIN_PASSWORD --admin_email=ADMIN_EMAIL
```

### Scaffold
* interactive create config file and config local
* copy over .htcacess
* gitignore
* composer
* package.json
