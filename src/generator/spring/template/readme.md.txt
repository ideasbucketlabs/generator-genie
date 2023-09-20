# {{ metadata.name | capitalize }}
{{ metadata.description }}

## List of all Gradle commands that are available
### In *nix based system
```sh
./gradlew tasks
```
### In Windows based system
```sh
gradlew.bat tasks
```

{%- if dependenciesIds contains "spotless" %}
## Apply Code format
### In *nix based system
```sh
./gradlew spotlessApply
```
### In Windows based system
```sh
gradlew.bat spotlessApply
```
{%- endif %}

{%- if dependenciesIds contains "spotless" %}
## Check for Code format violation
### In *nix based system
```sh
./gradlew spotlessCheck
```
### In Windows based system
```sh
gradlew.bat spotlessCheck
```
{%- endif %}

### Reference Documentation
For further reference, please consider the following sections:

* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.1.3/gradle-plugin/reference/html/#build-image)
{%- if kotlinSelected %}
* [Coroutines section of the Spring Framework Documentation](https://docs.spring.io/spring/docs/6.0.11/spring-framework-reference/languages.html#coroutines)
{%- endif %}
{%- if dependenciesIds contains "configuration-processor" %}
* [Spring Configuration Processor](https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/index.html#appendix.configuration-metadata.annotation-processor)
{%- endif %}
{%- if dependenciesIds contains "data-jdbc" %}
[Spring Data JDBC](https://spring.io/projects/spring-data-jdbc)
{%- endif %}
{%- if dependenciesIds contains "data-r2dbc" %}
* [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc)
{%- endif %}
{%- if dependenciesIds contains "data-jpa" %}
* [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
{%- endif %}
{%- if dependenciesIds contains "data-neo4j" %}
* [Spring Data Neo4J](https://spring.io/projects/spring-data-neo4j)
{%- endif %}
{%- if dependenciesIds contains "security" %}
* [Spring Security](https://spring.io/projects/spring-security)
{%- endif %}
{%- if dependenciesIds contains "webflux" %}
* [Spring Reactive Web](https://docs.spring.io/spring-boot/docs/3.1.3/reference/htmlsingle/index.html#web.reactive)
{%- endif %}
{%- if dependenciesIds contains "kafka" %}
* [Kafka in Spring](https://docs.spring.io/spring-kafka/docs/current/reference/html/#introduction)
{%- endif %}
{%- if dependenciesIds contains "cloud-gateway" %}
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway#overview)
{%- endif %}
{%- if dependenciesIds contains "cloud-stream" %}
* [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream)
{%- endif %}
{%- if dependenciesIds contains "webflux" %}
* [Building a Reactive RESTful Web Service](https://spring.io/guides/gs/reactive-rest-service/)
{%- endif %}
{%- if dependenciesIds contains "pebble" %}
* [Pebble Documentation](https://pebbletemplates.io/)
{%- endif %}
