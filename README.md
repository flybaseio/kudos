# Kudos for your site

Kudos for your site and blogs powered by Flybase

The idea is to give people Kudo support for their site or blog. Originally Kudos have been introduced by the [Svbtle blog](https://svbtle.com/) engine.

## Installation

Follow these steps to setup kudos for your site.

**Step 1 - Flybase account**  

This kudo script uses Flybase as the backend data store. As such, you first need to create a [Flybase account](https://flybase.io/) and create a new app. You can obviously also reuse an existing one if you want so.

**Step 2 - Configure Flybase**  

Open `kudos.flybase.js` and change the  `YOUR-API-KEY`, `YOUR-APP` and `kudos` to have it point to the account you just created in step 1.

```javascript
...
// replace this url with yours!!
var flybaseKudos = new Flybase("YOUR-API-KEY", "YOUR-APP", "kudos");
    ...
...
```


**Step 3 - Include kudo scripts**  
Include the kudo scripts from the `dist` directory

```html
<!-- Kudos script -->
<script src="https://cdn.flybase.io/flybase.js?latest=1"></script>
<script type="text/javascript" src="kudos/kudos.js"></script>
<script type="text/javascript" src="kudos/kudos.flybase.js"></script>
<link rel="stylesheet" href="kudos/kudos.css">
```

Note that you need to have jQuery as well.

**Step 4 - Add HTML snippet**  
As the last step include the following snippet

```html
<figure class="kudo"></figure>
```

in your DOM where you'd like to have the kudo element appear and initialize it by invoking

```javascript
$('figure.kudo').kudoable({
	dataStore: window.flybaseStorage
});
```

That's it. You should be ready to go.

## Issues, Bugs, Enhancements..

Simply use [GitHub's issues](https://github.com/flybaseio/kudos/issues). PRs are welcome as well.

## Credits

Credits have to be given to [Amit Upadhyay](http://amitu.com/2013/04/kudos-using-parse-for-jekyll/) who provided the original Svbtle independent Kudo implementation by using [Parse](https://parse.com/) as the backend service.
