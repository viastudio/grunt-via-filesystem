# grunt-via-filesystem

> Grunt plugin for setting up temp directories and symlinks based on environment.

## Installation

In your `package.json` file, add this plugin as a dependency.

```javascript

"dependencies": {
    "grunt-via-filesystem": "git+ssh://git@github.com:viastudio/grunt-via-filesystem.git"
}
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-via-filesystem');
```

## The "via_filesystem" task

### Usage
In your project's Gruntfile, add a section named `via_filesystem` to the data object passed into `grunt.initConfig()`.

You may define symlinks and directories per environment or set defaults for all environments.  A typical setup is below where the `tmp` and `uploads` directories are created on every environment, but the uploads folder on dev is using a shared symlink.

Symlinks are created first. So, in this example a symlink for the uploads directory would be created first and therefore the directory creation for the `uploads` dir will be skipped in the `dev` environment.

```js
grunt.initConfig({

  via_filesystem: {
    default: {
      symLinks: [],
      dirs: [
        {
            path: 'cakephp/app/uploads',
            permissions: '0777'
        },
        {
            path: 'cakephp/app/tmp',
            permissions: '0777'
        },
      ]
    },
    dev: {
      symLinks: [
        {
          src: '/var/www/<%= pkg.domain %>/cakephp/app/uploads',
          dest: 'cakephp/app/uploads'
        },
      ],
      },
      stage: {
      },
      prod: {
      }
  }

});
```

