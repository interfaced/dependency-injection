const path = require('path');
const morph = require('morph');
const _ = require('lodash');

const schemeDetector = require('./scheme-detector');
const DependencyMatcher = require('./dependency-matcher');
const graphResolver = require('./tools/graph-resolver');

const ProviderType = require('./datatype/provider-type');
const providerRenderers = {
	// eslint-disable-next-line global-require
	[ProviderType.CLASS]: require('./renderers/provider/class')
};

const InjectorType = require('./datatype/injector-type');
const dependencyRenderers = {
	// eslint-disable-next-line global-require
	[InjectorType.PROPERTY]: require('./renderers/dependency/property'),
	// eslint-disable-next-line global-require
	[InjectorType.SETTER]: require('./renderers/dependency/setter')
};

const {PARTIAL} = require('./datatype/import-type');

const createImportSpecifier = (type, className) => {
	if (type === PARTIAL) {
		return `{${className}}`;
	}

	return className;
};


/**
 * @param {InjectorType} injectorType
 * @return {boolean}
 */
const isSoftDependency = function(injectorType) {
	return [InjectorType.PROPERTY, InjectorType.SETTER].includes(injectorType);
};


/**
 * @param {InjectorType} injectorType
 * @return {boolean}
 */
const isHardDependency = function(injectorType) {
	return [InjectorType.CONSTRUCTOR].includes(injectorType);
};


/**
 */
class Builder {
	/**
	 * @param {TemplateHelper} templateHelper
	 * @param {Config} zbConfig
	 */
	constructor(templateHelper, zbConfig) {
		this._templateHelper = templateHelper;

		this._applicationConfig = zbConfig;
	}

	/**
	 * @param {FileIndex} fileIndex
	 * @return {string} generated code of base-service-container
	 */
	build(fileIndex) {
		const {name, src} = this._applicationConfig.project;
		const diConfig = this._applicationConfig.extensions.di;

		// Detect scheme
		const foldersConfig = diConfig.servicesAutodetect;
		const servicesConfig = diConfig.services;

		const detectedScheme = schemeDetector(src, foldersConfig, fileIndex);
		const scheme = _.merge(detectedScheme, servicesConfig);
		const serviceList = Object.keys(scheme).sort();

		// Match class-level parameters in scheme
		const dependencyMatcher = new DependencyMatcher();
		dependencyMatcher.setFileIndex(fileIndex);
		dependencyMatcher.setScheme(scheme);
		dependencyMatcher.matchAllSchemeDependencies(scheme);

		// Build hard deps graph
		const graph = _.zipObject(serviceList, serviceList.map((serviceName) => {
			const serviceClass = scheme[serviceName]._class;
			const params = fileIndex.getByClass(serviceClass).getParameters();

			return params
				.filter((param) => isHardDependency(param.injectorType))
				.map((param) => scheme[serviceName][param.parameterName])
				.filter((value) => value.startsWith('@'))
				.map((value) => value.substr(1));
		}));

		// Resolve construction order
		const order = graphResolver.getOrder(graph);

		// Prepare Template Data
		const services = _.zipObject(serviceList, serviceList.map((serviceName) => {
			const schemeEntry = scheme[serviceName];
			const serviceClass = schemeEntry._class;
			const importType = schemeEntry._import;
			const importPath = path.join(name, schemeEntry._path.replace('.js', ''));
			const params = fileIndex.getByClass(serviceClass).getParameters();
			const softParams = params.filter((param) => isSoftDependency(param.injectorType));
			const relations = softParams.map((param) => _.assign(param, {
				serviceName,
				value: schemeEntry[param.parameterName]
			}));

			return {
				serviceName,
				serviceClass,
				group: schemeEntry._group,
				providerType: ProviderType.CLASS,
				providerData: {
					importType,
					importPath,
					constructorFunction: serviceClass,
					// TODO set by index
					constructorArgs: graph[serviceName].map((serviceName) => `@${serviceName}`)
				},
				relations
			};
		}));

		const groups = [];
		serviceList.forEach((serviceName) => {
			const schemeEntry = scheme[serviceName];
			const groupName = schemeEntry._group;
			if (groupName) {
				groups[groupName] = groups[groupName] || [];
				groups[groupName].push(serviceName);
			}
		});
		groups['scenes'] = groups['scenes'] || [];

		const scenes = groups['scenes'].map((serviceName) => ({
			serviceName,
			sceneName: morph.toDashed(scheme[serviceName]._class)
		}));

		// Prerender template data


		const imports = _.values(services)
			.filter((record) => record.providerType === ProviderType.CLASS)
			.map((record) => record.providerData)
			.sort((a, b) => a.constructorFunction.localeCompare(b.constructorFunction))
			.map(({constructorFunction, importPath, importType}) => {
				const importSpecifier = createImportSpecifier(importType, constructorFunction);

				return `import ${importSpecifier} from "${importPath}";`;
			});

		const construction = order.map((serviceName) => {
			const serviceRecord = services[serviceName];
			const render = providerRenderers[serviceRecord.providerType];

			return render('this', serviceName, serviceRecord.providerData);
		});

		const relationRecords = _.flatten(serviceList.map((serviceName) => services[serviceName].relations));
		const relations = relationRecords.map((record) => {
			const render = dependencyRenderers[record.injectorType];

			return render('this', record.serviceName, record.injectorData, record.value);
		});

		const options = {
			locations: [path.resolve(__dirname, 'templates')]
		};

		return this._templateHelper.render('base-service-container.js.tpl', {
			// DIC data
			imports,
			construction,
			relations,
			scenes,
			services: _.values(services)
		}, options);
	}
}


/**
 *
 */
module.exports = Builder;
