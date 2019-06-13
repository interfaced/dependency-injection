# zombiebox-extenstion-dependency-injection

[ZombieBox](http://zombeibox.tv) extension that adds Dependency Injection support.


It operates by scanning application source code, finding injection targets and services that provide classes and, building dependency graph and generating a `BaseServiceContainer` class that handles their initialization, cross-dependencies and populates targets properties with injection values. 

## Configuration

```js
module.exports = () => ({
	extensions: {
		di: {
			services: { /* Dictionary of explicitly configured services */ },
			servicesAutodetect: [ /* Array of service detection roots */]
		}
	}	
})
```

## Services

Services are classes that are meant to be injected. They are listed in config either explicitly, or as part of automatic detection roots.

### Explicit declaration

Explicit services are configured under `extensions.di.services` filed as an object with its keys being services names and values – objects configuring the way service should be instantiated and its dependencies.

Configuration fields are:

* `_class` – service class name
* `_import` – [`ImportType`](./lib/datatype/import-type.js) (`"default"` or `"partial"`), the way ES6 modules should be imported
* `_path` – path to file with this class declaration
* `_group` - semantic group this service will be put into

The rest of the keys are dependencies of this service.

Example: 
```js
movie: {
	_class: 'Movie',
	_group: 'controller',
	_import: ImportType.DEFAULT,
    _path: '/controllers/movie/movie.js',
	sceneMovieCard: '{MovieCard}',
	sceneMovieList: '{MovieList}',
	repositoryMovie: '@repositoryMovie'
}
``` 

This declares that:

* `MovieController` class should imported from `/controllers/movie/movie.js` and constructed in service container
* It can be imported as `default` import
* Its instance should be named `movie`
* And placed into `controller` namespace
* It depends on `repositoryMovie` service
* It depends on `MovieCard` and `MovieList` classes

And will generate `BaseServiceContainer` class with the following structure (simplified):

```js
// .generated/dependency-injection/base-service-container.js
import Movie from '<APP_ALIAS>/controllers/movie/movie.js';

export default class{
	constructor() {
		this.movie = new MovieController();
	}
}
```

### Automatic detection

Services can be automatically detected under service roots declared in `servicesAutodetect` config key. 
The default value for this field contains `scenes` and `service` folders.

Root entry can either be a string, or object with fields `group` and `directory`


```js
{
   group: 'string',
   directory: 'string'
}
```

## Dependency detection

### Properties

Public class properties with type annotation comment starting with `:inject`:

```js
class MovieController {
	constructor() {
		/**
		 * @type {MovieList}:inject
		 */
		this.sceneMovieList;
	}
}
```

or:

```js
/**
 * @type {MovieList}:inject
 */
MovieController.prototype.sceneMovieList;
```

### Setter methods

Methods with parameters that have their description start with `:inject`

```js
class MovieController {
	/**
	 * @param {MovieList} sceneMovieList :inject
	 */
	setSceneMovieList(sceneMovieList) {
		this._sceneMovieList = sceneMovieList;
	}
}
```

### Constructor

Constructor parameters that have their description start with `:inject`

```js
class MovieController {
	/**
	 * @param {MovieList} sceneMovieList :inject
	 * @param {MovieCard} sceneMovieCard :inject
	 */
	constructor(sceneMovieList, sceneMovieCard) {
		this._sceneMovieList = sceneMovieList;
		this._sceneMovieCard = sceneMovieCard;
	}
}
```


## Dependency matching

Dependency injection will match classes as following:

* Class exactly matching declared dependency 
* Class inheriting from declared dependency
* Class implementing interface declared in dependency

If there are several classes matching declared dependency there's no guarantee which one will be injected.
