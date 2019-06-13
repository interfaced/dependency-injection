import BaseApplication from "generated/base-application";
<%= imports.join('\n') %>


/**
 */
export default class {
	/**
	 * @param {BaseApplication} application
	 */
	constructor(application) {
		/**
		 * As proxy to system services
		 * @type {BaseApplication}
		 */
		this.application = application;<%
		services.forEach(function(service){ %>

		/**
		 * @type {<%=service.serviceClass%>}
		 */
		this.<%=service.serviceName%>;<%
		}); %>
	}

	/**
	 */
	bootstrap() {
		// Constructing
		<%= construction.join('\n\t\t') %>

		// Interlacing
		<%= relations.join('\n\t\t') %>

		// Setup scenes<%
		scenes.forEach(function(scene){ %>
		this.application.addScene(this.<%=scene.serviceName%>, '<%=scene.sceneName%>');<% });
		%>
	}
};
