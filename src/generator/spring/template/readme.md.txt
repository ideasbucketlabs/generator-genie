# {{ metadata.name | capitalize }}
{{ metadata.description }}

{%- if buildTool == "gradle" -%}
## List of all Gradle commands that are available
### In *nix based system
```sh
./gradlew tasks
```
### In Windows based system
```sh
gradlew.bat tasks
```
{%- endif -%}
{%- if dependenciesIds contains "graphql-code-generation" -%}
## GraphQL code generation with DGS

This project has been configured to use the Netflix DGS Codegen plugin.
This plugin can be used to generate client files for accessing remote GraphQL services.
The default setup assumes that the GraphQL schema file for the remote service is added to the `src/main/resources/graphql-client/` location.

You can learn more about the [plugin configuration options](https://netflix.github.io/dgs/generating-code-from-schema/#configuring-code-generation) and
[how to use the generated types](https://netflix.github.io/dgs/generating-code-from-schema/) to adapt the default setup.
{%- endif -%}

{%- if dependenciesIds contains "spotless" -%}
## Apply Code format
### In *nix based system
```sh
{%- if buildTool == "gradle" -%}
./gradlew spotlessApply
{%- else -%}
mvn spotless:apply
{%- endif -%}
```
### In Windows based system
```sh
{%- if buildTool == "gradle" -%}
gradlew.bat spotlessApply
{%- else -%}
mvn.bat spotless:apply
{%- endif -%}
```
## Check for Code format violation
### In *nix based system
```sh
{%- if buildTool == "gradle" -%}
./gradlew spotlessCheck
{%- else -%}
mvn spotless:check
{%- endif -%}
```
### In Windows based system
```sh
{%- if buildTool == "gradle" -%}
gradlew.bat spotlessCheck
{%- else -%}
mvn.bat spotless:check
{%- endif -%}
```
{%- endif -%}

### Reference Documentation
For further reference, please consider the following sections:

* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.1.3/gradle-plugin/reference/html/#build-image)
{%- if kotlinSelected -%}
* [Coroutines section of the Spring Framework Documentation](https://docs.spring.io/spring/docs/6.0.11/spring-framework-reference/languages.html#coroutines)
{%- endif -%}
{%- if dependenciesIds contains "configuration-processor" -%}
* [Spring Configuration Processor](https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/index.html#appendix.configuration-metadata.annotation-processor)
{%- endif -%}
{%- if dependenciesIds contains "data-jdbc" -%}
[Spring Data JDBC](https://spring.io/projects/spring-data-jdbc)
{%- endif -%}
{%- if dependenciesIds contains "data-r2dbc" -%}
* [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc)
{%- endif -%}
{%- if dependenciesIds contains "data-jpa" -%}
* [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
{%- endif -%}
{%- if dependenciesIds contains "data-neo4j" -%}
* [Spring Data Neo4J](https://spring.io/projects/spring-data-neo4j)
{%- endif -%}
{%- if dependenciesIds contains "security" -%}
* [Spring Security](https://spring.io/projects/spring-security)
{%- endif -%}
{%- if dependenciesIds contains "okta" -%}
* [Okta-Hosted Login Page Example](https://github.com/okta/samples-java-spring/tree/master/okta-hosted-login)
* [Custom Login Page Example](https://github.com/okta/samples-java-spring/tree/master/custom-login)
* [Okta Spring Security Resource Server Example](https://github.com/okta/samples-java-spring/tree/master/resource-server)
{%- endif -%}
{%- if dependenciesIds contains "native" -%}
* [GraalVM Native Image Support](https://docs.spring.io/spring-boot/docs/3.2.1/reference/html/native-image.html#native-image)
{%- endif -%}
{%- if dependenciesIds contains "web" -%}
* [Spring Web](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/index.html#web)
{%- endif -%}
{%- if dependenciesIds contains "webflux" -%}
* [Spring Reactive Web](https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/index.html#web.reactive)
{%- endif -%}
{%- if dependenciesIds contains "kafka" -%}
* [Kafka in Spring](https://docs.spring.io/spring-kafka/docs/current/reference/html/#introduction)
{%- endif -%}
{%- if dependenciesIds contains "cloud-gateway" -%}
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway#overview)
{%- endif -%}
{%- if dependenciesIds contains "cloud-stream" -%}
* [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream)
{%- endif -%}
{%- if dependenciesIds contains "webflux" -%}
* [Building a Reactive RESTful Web Service](https://spring.io/guides/gs/reactive-rest-service/)
{%- endif -%}
{%- if dependenciesIds contains "thymeleaf" -%}
* [Thymeleaf](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/index.html#web.servlet.spring-mvc.template-engines)
{%- endif -%}
{%- if dependenciesIds contains "jte" -%}
* [JTE](https://jte.gg/)
{%- endif -%}
{%- if dependenciesIds contains "htmx" -%}
* [htmx](https://www.youtube.com/watch?v=j-rfPoXe5aE)
{%- endif -%}
{%- if dependenciesIds contains "vaadin" -%}
* [Vaadin](https://vaadin.com/docs)
{%- endif -%}
{%- if dependenciesIds contains "spring-modulith" -%}
* [Spring Modulith](https://docs.spring.io/spring-modulith/reference/)
{%- endif -%}
{%- if dependenciesIds contains "pebble" -%}
* [Pebble Documentation](https://pebbletemplates.io/)
{%- endif -%}
{%- if dependenciesIds contains "timefold-solver" -%}
* [Timefold Solver](https://timefold.ai/docs/timefold-solver/latest/quickstart/spring-boot/spring-boot-quickstart#springBootJavaQuickStart)
{%- endif -%}
{%- if dependenciesIds contains "actuator" -%}
* [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/index.html#actuator)
{%- endif -%}
{%- if dependenciesIds contains "oauth2-client" -%}
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
{%- endif -%}
{%- if dependenciesIds contains "spring-shell" -%}
* [Spring Shell](https://spring.io/projects/spring-shell)
{%- endif -%}
* [Handling Form Submission](https://spring.io/guides/gs/handling-form-submission/)
{%- if dependenciesIds contains "vaadin" or dependenciesIds contains "htmx" -%}

### Guides
The following guides illustrate how to use some features concretely:
{%- if dependenciesIds contains "vaadin" -%}
* [Creating CRUD UI with Vaadin](https://spring.io/guides/gs/crud-with-vaadin/)
{%- endif -%}
{%- if dependenciesIds contains "htmx" -%}
* [htmx](https://www.youtube.com/watch?v=j-rfPoXe5aE)
{%- endif -%}

{%- endif -%}
### Additional Links
These additional references should also help you:
{%- if buildTool == "gradle" -%}
* [Gradle Build Scans – insights for your project's build](https://scans.gradle.com#gradle)
{%- else -%}
* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
{%- endif -%}
* [Configure AOT settings in Build Plugin](https://docs.spring.io/spring-boot/docs/3.2.1/gradle-plugin/reference/htmlsingle/#aot)
{%- if dependenciesIds contains "timefold-solver" -%}
* [Timetabling sample. Assign lessons to timeslots and rooms to produce a better schedule for teachers and students](https://github.com/TimefoldAI/timefold-quickstarts/tree/stable/technology/java-spring-boot)
{%- endif -%}

{%- if dependenciesIds contains "native" -%}
    {%- if buildTool == "gradle" -%}
## GraalVM Native Support

This project has been configured to let you generate either a lightweight container or a native executable.
It is also possible to run your tests in a native image.

### Lightweight Container with Cloud Native Buildpacks
If you're already familiar with Spring Boot container images support, this is the easiest way to get started.
Docker should be installed and configured on your machine prior to creating the image.

To create the image, run the following goal:

```
$ ./gradlew bootBuildImage
```

Then, you can run the app like any other container:

```
$ docker run --rm -p 8080:8080 {{ metadata.artifact }}:0.0.1-SNAPSHOT
```

### Executable with Native Build Tools
Use this option if you want to explore more options such as running your tests in a native image.
The GraalVM `native-image` compiler should be installed and configured on your machine.

NOTE: GraalVM 22.3+ is required.

To create the executable, run the following goal:

```
$ ./gradlew nativeCompile
```

Then, you can run the app as follows:
```
$ build/native/nativeCompile/{{ metadata.artifact }}
```

You can also run your existing tests suite in a native image.
This is an efficient way to validate the compatibility of your application.

To run your existing tests in a native image, run the following goal:

```
$ ./gradlew nativeTest
```
    {%- else -%}
## GraalVM Native Support

This project has been configured to let you generate either a lightweight container or a native executable.
It is also possible to run your tests in a native image.

### Lightweight Container with Cloud Native Buildpacks
If you're already familiar with Spring Boot container images support, this is the easiest way to get started.
Docker should be installed and configured on your machine prior to creating the image.

To create the image, run the following goal:

```
$ ./mvnw spring-boot:build-image -Pnative
```

Then, you can run the app like any other container:

```
$ docker run --rm -p 8080:8080 {{ metadata.artifact }}:0.0.1-SNAPSHOT
```

### Executable with Native Build Tools
Use this option if you want to explore more options such as running your tests in a native image.
The GraalVM `native-image` compiler should be installed and configured on your machine.

NOTE: GraalVM 22.3+ is required.

To create the executable, run the following goal:

```
$ ./mvnw native:compile -Pnative
```

Then, you can run the app as follows:
```
$ target/{{ metadata.artifact }}
```

You can also run your existing tests suite in a native image.
This is an efficient way to validate the compatibility of your application.

To run your existing tests in a native image, run the following goal:

```
$ ./mvnw test -PnativeTest
```
    {%- endif -%}
{%- endif -%}

{%- if dependenciesIds contains "okta" -%}

## OAuth 2.0 and OIDC with Okta

If you don't have a free Okta developer account, you can create one with [the Okta CLI](https://cli.okta.com):

```bash
$ okta register
```

Then, register your Spring Boot app on Okta using:

```bash
$ okta apps create
```

Select **Web** > **Okta Spring Boot Starter** and accept the default redirect URIs.
{%- endif -%}
{%- if dependenciesIds contains "jte" -%}
## JTE

This project has been configured to use [JTE precompiled templates](https://jte.gg/pre-compiling/).

However, to ease development, those are not enabled out of the box.
For production deployments, you should remove

```properties
gg.jte.development-mode=true
```

from the `application.properties` file and set

```properties
gg.jte.use-precompiled-templates=true
```
instead.
For more details, please take a look at [the official documentation](https://jte.gg/spring-boot-starter-3/).
{%- endif -%}

{%- if dependenciesIds contains "docker-compose-setup" -%}
### Docker Compose support
This project contains a Docker Compose file named `compose.yaml`.
In this file, the following services have been defined:
{%- if dependenciesIds contains "data-neo4j" -%}
* neo4j: [`neo4j:latest`](https://hub.docker.com/_/neo4j)
{%- endif -%}

Please review the tags of the used images and set them to the same as you're running in production.
{%- endif -%}
