describe('Parse handlers TAG', () => {
	const chai = require('chai');
	chai.use(require('dirty-chai'));
	const expect = chai.expect;
	const handle = alias.require('@sut/parse-helper');
	const doctrine = require('doctrine');

	describe('method: .isTagDependency', () => {
		it('@protected -> false', () => {
			const tag = doctrine.parse('@protected').tags[0];
			expect(handle.tag.isTagDependency(tag)).eq(false);
		});
		it('@type {app.service.MyService}:inject -> true', () => {
			const tag = doctrine.parse('@type {app.service.MyService}:inject').tags[0];
			expect(handle.tag.isTagDependency(tag)).eq(true);
		});
		it('@type {app.service.MyService}:inject comment-> true', () => {
			const tag = doctrine.parse('@type {app.service.MyService}:inject comment').tags[0];
			expect(handle.tag.isTagDependency(tag)).eq(true);
		});
		it('@type {app.service.MyService}:dependency -> false', () => {
			const tag = doctrine.parse('@type {app.service.MyService}:dependency').tags[0];
			expect(handle.tag.isTagDependency(tag)).eq(false);
		});
	});


	describe('method: .isTagParamDependency', () => {
		it('@param {SomeType} paramname :inject -> true', () => {
			const tag = doctrine.parse('@param {SomeType} paramname :inject').tags[0];
			expect(handle.tag.isTagParamDependency(tag)).eq(true);
		});
		it('@param {SomeType} paramname :inject comment -> true', () => {
			const tag = doctrine.parse('@param {SomeType} paramname :inject comment').tags[0];
			expect(handle.tag.isTagParamDependency(tag)).eq(true);
		});
		it('@param {SomeType} paramname comment -> false', () => {
			const tag = doctrine.parse('@param {SomeType} paramname comment').tags[0];
			expect(handle.tag.isTagParamDependency(tag)).eq(false);
		});
		it('@return {SomeType} comment -> false', () => {
			const tag = doctrine.parse('@return {SomeType} comment').tags[0];
			expect(handle.tag.isTagParamDependency(tag)).eq(false);
		});
	});

	describe('method: .getDependencyType', () => {
		it('@protected -> false', () => {
			const tag = doctrine.parse('@protected').tags[0];
			expect(handle.tag.getDependencyType(tag)).eq(null);
		});
		it('@type {string}:inject -> string', () => {
			const tag = doctrine.parse('@type {string}:inject').tags[0];
			expect(handle.tag.getDependencyType(tag)).eq('string');
		});
		it('@type {app.service.MyService}:inject -> app.service.MyService', () => {
			const tag = doctrine.parse('@type {app.service.MyService}:inject').tags[0];
			expect(handle.tag.getDependencyType(tag)).eq('app.service.MyService');
		});
		it('Param tag', () => {
			const tag = doctrine.parse('@param {myapp.SomeType} paramname :inject comment').tags[0];
			expect(handle.tag.getDependencyType(tag)).eq('myapp.SomeType');
		});
	});

	describe('method: .isConstructor', () => {
		it('method exists', () => {
			expect(handle.tag.isConstructor)
				.is.a('function');
		});
		it('@constructor -> true', () => {
			const tag = doctrine.parse('@constructor').tags[0];
			expect(handle.tag.isConstructor(tag)).eq(true);
		});
		it('other tag -> false', () => {
			const tag = doctrine.parse('@protected').tags[0];
			expect(handle.tag.isConstructor(tag)).eq(false);
		});
	});

	describe('method: .isImplements', () => {
		it('method exists', () => {
			expect(handle.tag.isImplements)
				.is.a('function');
		});
		it('@implements {my.Interface} -> true', () => {
			const tag = doctrine.parse('@implements {my.Interface}').tags[0];
			expect(handle.tag.isImplements(tag))
				.equal(true);
		});
	});

	describe('method: .getInterface', () => {
		it('method exists', () => {
			expect(handle.tag.getInterface)
				.is.a('function');
		});
		it('@implements {my.Interface} -> my.Interface', () => {
			const tag = doctrine.parse('@implements {my.Interface}').tags[0];
			expect(handle.tag.getInterface(tag))
				.equal('my.Interface');
		});
		it('other tag -> null', () => {
			const tag = doctrine.parse('@type {my.Interface}').tags[0];
			expect(handle.tag.getInterface(tag))
				.equal(null);
		});
	});

	describe('method: .isExtends', () => {
		it('method exists', () => {
			expect(handle.tag.isExtends)
				.is.a('function');
		});
		it('@extends {my.SuperClass} -> true', () => {
			const tag = doctrine.parse('@extends {my.SuperClass}').tags[0];
			expect(handle.tag.isExtends(tag)).is.true();
		});
		it('other tag -> false', () => {
			const tag = doctrine.parse('@type {my.Interface}').tags[0];
			expect(handle.tag.isExtends(tag))
				.equal(false);
		});
	});

	describe('method: .getExtends', () => {
		it('method exists', () => {
			expect(handle.tag.getExtends)
				.is.a('function');
		});
		it('@extends {my.SuperClass} -> my.SuperClass', () => {
			const tag = doctrine.parse('@extends {my.SuperClass}').tags[0];
			expect(handle.tag.getExtends(tag))
				.equal('my.SuperClass');
		});
		it('other tag -> null', () => {
			const tag = doctrine.parse('@type {my.SuperClass}').tags[0];
			expect(handle.tag.getExtends(tag))
				.equal(null);
		});
	});

	describe('jsdoc hanlders', () => {
		const jsdocConstructor = doctrine.parse([
			'/**',
			' * @constructor',
			' * @extends {my.SuperClass}',
			' * @implements {sandbox.controller.IMovieController}',
			' * @implements {zb.IController}',
			' */'
		].join('\n'), {unwrap: true});
		const fixtureConstructorInterfaces = [
			'sandbox.controller.IMovieController',
			'zb.IController'
		];
		const fixtureConstructorBaseClass = [
			'my.SuperClass'
		];
		const jsdocProperty = doctrine.parse([
			'/**',
			' * @protected',
			' * @type {sandbox.controller.MovieController}',
			' */'
		].join('\n'), {unwrap: true});
		const fixtureConstructorWithDeps = doctrine.parse([
			'/**',
			' * @constructor',
			' * @param {sandbox.scene.MovieCard} sceneMovieCard :inject',
			' * @param {sandbox.scene.MovieList} sceneMovieList :inject',
			' * @implements {sandbox.controller.IMovieController}',
			' * @implements {zb.IController}',
			' */'
		].join('\n'), {unwrap: true});
		const expectedConstructorDeps = {
			sceneMovieCard: 'sandbox.scene.MovieCard',
			sceneMovieList: 'sandbox.scene.MovieList'
		};

		describe('method: jsdoc.isConstructor', () => {
			it('method exists', () => {
				expect(handle.jsdoc.isConstructor)
					.is.a('function');
			});
			it('construcotr jsdoc -> true', () => {
				expect(handle.jsdoc.isConstructor(jsdocConstructor))
					.equal(true);
			});
			it('property jsdox -> false', () => {
				expect(handle.jsdoc.isConstructor(jsdocProperty))
					.equal(false);
			});
		});

		describe('method: jsdoc.getImplementedInterfaces', () => {
			it('method exists', () => {
				expect(handle.jsdoc.getImplementedInterfaces)
					.is.a('function');
			});
			it('interfaces of constructor jsdoc', () => {
				expect(handle.jsdoc.getImplementedInterfaces(jsdocConstructor))
					.deep.equal(fixtureConstructorInterfaces);
			});
		});

		describe('method: jsdoc.getExtendedClass', () => {
			it('method exists', () => {
				expect(handle.jsdoc.getExtendedClass)
					.is.a('function');
			});
			it('base class of constructor jsdoc', () => {
				expect(handle.jsdoc.getExtendedClass(jsdocConstructor))
					.deep.equal(fixtureConstructorBaseClass);
			});
		});

		describe('method: jsdoc.getParamDependencies', () => {
			it('method exists', () => {
				expect(handle.jsdoc.getParamDependencies)
					.is.a('function');
			});
			it('parses "@param {Type} name :inject" tags from constructor', () => {
				expect(handle.jsdoc.getParamDependencies(fixtureConstructorWithDeps))
					.deep.equal(expectedConstructorDeps);
			});
		});
	});
});
