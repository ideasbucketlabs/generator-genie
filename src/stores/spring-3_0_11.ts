/* eslint vue/max-len: 0 */
import type { Dependency } from '@/entity/Dependency'

const data: Dependency[] = [
    {
        id: 'developer-tools',
        group: 'Developer Tools',
        packages: [
            {
                name: 'GraalVM Native Support',
                id: 'native',
                description:
                    'Support for compiling Spring applications to native executables using the GraalVM native-image compiler.',
                plugin: true,
                groupId: 'org.graalvm.buildtools.native',
                version: '0.9.27'
            },
            {
                name: 'Spring Boot DevTools',
                id: 'devtools',
                description:
                    'Provides fast application restarts, LiveReload, and configurations for enhanced development experience.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-devtools'
            },
            {
                name: 'Lombok',
                id: 'lombok',
                description: 'Java annotation library which helps to reduce boilerplate code.',
                groupId: 'org.projectlombok',
                artifactId: 'lombok'
            },
            {
                name: 'Spring Configuration Processor',
                id: 'configuration-processor',
                description:
                    'Generate metadata for developers to offer contextual help and "code completion" when working with custom configuration keys (ex.application.properties/.yml files).',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-configuration-processor'
            }
        ]
    },
    {
        id: 'web',
        group: 'Web',
        packages: [
            {
                name: 'Spring Web',
                id: 'web',
                description:
                    'Build web, including RESTful, applications using Spring MVC. Uses Apache Tomcat as the default embedded container.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-web'
            },
            {
                name: 'Spring Reactive Web',
                id: 'webflux',
                description: 'Build reactive web applications with Spring WebFlux and Netty.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-webflux',
                testPackages: [
                    {
                        name: 'Reactor Test',
                        id: 'reactor-test',
                        description: '',
                        groupId: 'io.projectreactor',
                        artifactId: 'reactor-test'
                    }
                ]
            },
            {
                name: 'Spring for GraphQL',
                id: 'graphql',
                description: 'Build GraphQL applications with Spring for GraphQL and GraphQL Java.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-graphql',
                testPackages: [
                    {
                        name: 'Spring GraphQL Test',
                        id: 'graphql-test',
                        description: '',
                        groupId: 'org.springframework.graphql',
                        artifactId: 'spring-graphql-test'
                    },
                    {
                        name: 'Spring Reactive Web',
                        id: 'webflux',
                        description: 'Build reactive web applications with Spring WebFlux and Netty.',
                        groupId: 'org.springframework.boot',
                        artifactId: 'spring-boot-starter-webflux'
                    }
                ]
            },
            {
                name: 'Rest Repositories',
                id: 'data-rest',
                description: 'Exposing Spring Data repositories over REST via Spring Data REST.',
                groupId: 'org.springframework.boot:',
                artifactId: 'spring-boot-starter-data-rest'
            },
            {
                name: 'Spring Session',
                id: 'session',
                description: 'Provides an API and implementations for managing user session information.',
                groupId: 'org.springframework.session',
                artifactId: 'spring-session-core'
            },
            {
                name: 'Rest Repositories HAL Explorer',
                id: 'data-rest-explorer',
                description: 'Browsing Spring Data REST repositories in your browser.',
                groupId: 'org.springframework.data',
                artifactId: 'spring-data-rest-hal-explorer'
            },
            {
                name: 'Spring HATEOAS',
                id: 'hateoas',
                description:
                    'Eases the creation of RESTful APIs that follow the HATEOAS principle when working with Spring / Spring MVC.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-hateoas'
            },
            {
                name: 'Spring Web Services',
                id: 'web-service',
                description:
                    'Facilitates contract-first SOAP development. Allows for the creation of flexible web services using one of the many ways to manipulate XML payloads.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-web-services'
            }
        ]
    },
    {
        id: 'template-engines',
        group: 'Template Engines',
        packages: [
            {
                name: 'Thymeleaf',
                id: 'thymeleaf',
                description:
                    'A modern server-side Java template engine for both web and standalone environments. Allows HTML to be correctly displayed in browsers and as static prototypes.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-thymeleaf'
            },
            {
                name: 'Pebble',
                id: 'pebble',
                groupId: 'io.pebbletemplates',
                artifactId: 'pebble-spring-boot-starter',
                version: '3.2.1',
                description:
                    'Pebble is a Java templating engine inspired by Twig and similar to the Python Jinja Template Engine syntax. It features templates inheritance and easy-to-read syntax, ships with built-in autoescaping for security, and includes integrated support for internationalization.'
            }
        ]
    },
    {
        id: 'security',
        group: 'Security',
        packages: [
            {
                name: 'Spring Security',
                id: 'security',
                description: 'Highly customizable authentication and access-control framework for Spring applications.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-security',
                testPackages: [
                    {
                        name: 'Spring Security Test',
                        id: 'security-test',
                        description: '',
                        groupId: 'org.springframework.boot',
                        artifactId: 'spring-security-test'
                    }
                ]
            },
            {
                name: 'OAuth2 Client',
                id: 'oauth2-client',
                description: "Spring Boot integration for Spring Security's OAuth2/OpenID Connect client features.",
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-oauth2-client'
            },
            {
                name: 'OAuth2 Authorization Server',
                id: 'oauth2-authorization-server',
                description: 'Spring Boot integration for Spring Authorization Server.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-oauth2-authorization-server'
            },
            {
                name: 'OAuth2 Resource Server',
                id: 'oauth2-resource-server',
                description: "Spring Boot integration for Spring Security's OAuth2 resource server features.",
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-oauth2-resource-server'
            },
            {
                name: 'Spring LDAP',
                id: 'data-ldap',
                description:
                    'Makes it easier to build Spring based applications that use the Lightweight Directory Access Protocol.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-ldap'
            },
            {
                name: 'Okta',
                id: 'okta',
                description:
                    'Okta specific configuration for Spring Security/Spring Boot OAuth2 features. Enable your Spring Boot application to work with Okta via OAuth 2.0/OIDC.',
                groupId: 'com.okta.spring',
                artifactId: 'okta-spring-boot-starter',
                version: '3.0.4'
            }
        ]
    },
    {
        id: 'sql',
        group: 'SQL',
        packages: [
            {
                name: 'JDBC API',
                id: 'jdbc',
                description: 'Database Connectivity API that defines how a client may connect and query a database.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-jdbc'
            },
            {
                name: 'Spring Data JPA',
                id: 'data-jpa',
                description: 'Persist data in SQL stores with Java Persistence API using Spring Data and Hibernate.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-jpa'
            },
            {
                name: 'Spring Data JDBC',
                id: 'data-jdbc',
                description: 'Persist data in SQL stores with plain JDBC using Spring Data.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-jdbc'
            },
            {
                name: 'Spring Data R2DBC',
                id: 'data-r2dbc',
                description:
                    'Provides Reactive Relational Database Connectivity to persist data in SQL stores using Spring Data in reactive applications.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-r2dbc',
                testPackages: [
                    {
                        name: 'Reactor Test',
                        id: 'reactor-test',
                        description: '',
                        groupId: 'io.projectreactor',
                        artifactId: 'reactor-test'
                    }
                ]
            },
            {
                name: 'Liquibase Migration',
                id: 'liquibase',
                description: 'Liquibase database migration and source control library.',
                groupId: 'org.liquibase',
                artifactId: 'liquibase-core'
            },
            {
                name: 'Flyway Migration',
                id: 'flyway',
                description:
                    'Version control for your database so you can migrate from any version (incl. an empty database) to the latest version of the schema.',
                groupId: 'org.flywaydb',
                artifactId: 'flyway-core'
            },
            {
                name: 'JOOQ Access Layer',
                id: 'jooq',
                description:
                    'Generate Java code from your database and build type safe SQL queries through a fluent API.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-jooq'
            },
            {
                name: 'H2 Database',
                id: 'h2',
                description:
                    'Provides a fast in-memory database that supports JDBC API and R2DBC access, with a small (2mb) footprint. Supports embedded and server modes as well as a browser based console application.',
                groupId: 'com.h2database',
                artifactId: 'h2'
            },
            {
                name: 'HyperSQL Database',
                id: 'hsql',
                description: 'Lightweight 100% Java SQL Database Engine.',
                groupId: 'org.hsqldb',
                artifactId: 'hsqldb'
            },
            {
                name: 'MariaDB Driver',
                id: 'mariadb',
                description: 'MariaDB JDBC and R2DBC driver.',
                groupId: 'org.mariadb.jdbc',
                artifactId: 'mariadb-java-client'
            },
            {
                name: 'MS SQL Server Driver',
                id: 'sqlserver',
                description:
                    'A JDBC and R2DBC driver that provides access to Microsoft SQL Server and Azure SQL Database from any Java application.',
                groupId: 'com.microsoft.sqlserver',
                artifactId: 'mssql-jdbc'
            },
            {
                name: 'MySQL Driver',
                id: 'mysql',
                description: 'MySQL JDBC driver.',
                groupId: 'com.mysql',
                artifactId: 'mysql-connector-j'
            },
            {
                name: 'PostgreSQL Driver',
                id: 'postgresql',
                description:
                    'A JDBC and R2DBC driver that allows Java programs to connect to a PostgreSQL database using standard, database independent Java code.',
                groupId: 'org.postgresql',
                artifactId: 'postgresql'
            }
        ]
    },
    {
        id: 'no-sql',
        group: 'No SQL',
        packages: [
            {
                name: 'Spring Data Redis (Access+Driver)',
                id: 'data-redis',
                description:
                    'Advanced and thread-safe Java Redis client for synchronous, asynchronous, and reactive usage. Supports Cluster, Sentinel, Pipelining, Auto-Reconnect, Codecs and much more.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-redis'
            },
            {
                name: 'Spring Data Reactive Redis',
                id: 'data-redis-reactive',
                description: 'Access Redis key-value data stores in a reactive fashion with Spring Data Redis.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-redis-reactive',
                testPackages: [
                    {
                        name: 'Reactor Test',
                        id: 'reactor-test',
                        description: '',
                        groupId: 'io.projectreactor',
                        artifactId: 'reactor-test'
                    }
                ]
            },
            {
                name: 'Spring Data Elasticsearch (Access+Driver)',
                id: 'data-elasticsearch',
                description: 'A distributed, RESTful search and analytics engine with Spring Data Elasticsearch.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-elasticsearch'
            },
            {
                name: 'Spring Data Neo4j',
                id: 'data-neo4j',
                description:
                    'An open source NoSQL database that stores data structured as graphs consisting of nodes, connected by relationships.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-data-neo4j'
            }
        ]
    },
    {
        id: 'messaging',
        group: 'Messaging',
        packages: [
            {
                name: 'Spring Integration',
                id: 'integration',
                description:
                    'Adds support for Enterprise Integration Patterns. Enables lightweight messaging and supports integration with external systems via declarative adapters.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-integration'
            },
            {
                name: 'Spring for RabbitMQ',
                id: 'amqp',
                description:
                    'Gives your applications a common platform to send and receive messages, and your messages a safe place to live until received.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-amqp'
            },
            {
                name: 'Spring for Apache Kafka',
                id: 'kafka',
                description: 'Publish, subscribe, store, and process streams of records.',
                groupId: 'org.springframework.kafka',
                artifactId: 'spring-kafka'
            },
            {
                name: 'Spring for Apache Kafka Streams',
                id: 'kafka-streams',
                description: 'Building stream processing applications with Apache Kafka Streams.',
                groupId: 'org.apache.kafka',
                artifactId: 'kafka-streams'
            },
            {
                name: 'WebSocket',
                id: 'websocket',
                description: 'Build Servlet-based WebSocket applications with SockJS and STOMP.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-websocket'
            },
            {
                name: 'RSocket',
                id: 'rsocket',
                description: 'RSocket.io applications with Spring Messaging and Netty.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-rsocket',
                testPackages: [
                    {
                        name: 'Reactor Test',
                        id: 'reactor-test',
                        description: '',
                        groupId: 'io.projectreactor',
                        artifactId: 'reactor-test'
                    }
                ]
            }
        ]
    },
    {
        id: 'i-o',
        group: 'I/O',
        packages: [
            {
                name: 'Spring Batch',
                id: 'batch',
                description: 'Batch applications with transactions, retry/skip and chunk based processing.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-batch'
            },
            {
                name: 'Validation',
                id: 'validation',
                description: 'Bean Validation with Hibernate validator.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-validation'
            },
            {
                name: 'Java Mail Sender',
                id: 'mail',
                description: "Send email using Java Mail and Spring Framework's JavaMailSender.",
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-mail'
            },
            {
                name: 'Spring cache abstraction',
                id: 'cache',
                description:
                    'Provides cache-related operations, such as the ability to update the content of the cache, but does not provide the actual data store.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-cache'
            },
            {
                name: 'Spring Shell',
                id: 'spring-shell',
                description: 'Build command line applications with spring.',
                groupId: 'org.springframework.shell',
                artifactId: 'spring-shell-starter'
            }
        ]
    },
    {
        id: 'ops',
        group: 'OPS',
        packages: [
            {
                name: 'Spring Boot Actuator',
                id: 'actuator',
                description:
                    'Supports built in (or custom) endpoints that let you monitor and manage your application - such as application health, metrics, sessions, etc.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-starter-actuator'
            }
        ]
    },
    {
        id: 'observability',
        group: 'Observability',
        packages: [
            {
                name: 'Influx',
                id: 'influx',
                description:
                    'Publish Micrometer metrics to InfluxDB, a dimensional time-series server that support real-time stream processing of data.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-registry-influx'
            },
            {
                name: 'Prometheus',
                id: 'prometheus',
                description:
                    'Expose Micrometer metrics in Prometheus format, an in-memory dimensional time series database with a simple built-in UI, a custom query language, and math operations.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-registry-prometheus'
            },
            {
                name: 'Elastic APM',
                id: 'elastic-apm',
                description:
                    'Elastic APM is an application performance monitoring system built on the Elastic Stack. It allows you to monitor software services and applications in real-time, by collecting detailed performance information on response time for incoming requests, database queries, calls to caches, external HTTP requests, and more. This makes it easy to pinpoint and fix performance problems quickly.',
                groupId: 'co.elastic.apm',
                artifactId: 'apm-agent-api',
                version: '1.42.0'
            }
        ]
    },
    {
        id: 'code-formatter',
        group: 'Code Formatter',
        packages: [
            {
                name: 'Spotless',
                id: 'spotless',
                description:
                    'Spotless is a general-purpose formatting plugin. It is completely à la carte, but also includes powerful "batteries-included" if you opt-in.',
                parentName: 'Code Formatter',
                groupId: 'com.diffplug.spotless',
                version: '6.22.0',
                plugin: true
            }
        ]
    },
    {
        id: 'testing',
        group: 'Testing',
        packages: [
            {
                name: 'Testcontainers',
                id: 'testcontainers',
                description:
                    'Provide lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-testcontainers'
            },
            {
                name: 'Contract Verifier',
                id: 'cloud-contract-verifier',
                description:
                    'Moves TDD to the level of software architecture by enabling Consumer Driven Contract (CDC) development.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-contract-verifier'
            },
            {
                name: 'Contract Stub Runner',
                id: 'cloud-contract-stub-runner',
                description:
                    'Stub Runner for HTTP/Messaging based communication. Allows creating WireMock stubs from RestDocs tests.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-contract-stub-runner'
            },
            {
                name: 'Embedded LDAP Server',
                id: 'embedded-ldap',
                description: 'Provides a platform neutral way for running a LDAP server in unit tests.',
                groupId: 'com.unboundid',
                artifactId: 'unboundid-ldapsdk'
            }
        ]
    },
    {
        id: 'spring-cloud',
        group: 'Spring Cloud',
        packages: [
            {
                name: 'Cloud Bootstrap',
                id: 'cloud-starter',
                description:
                    'Non-specific Spring Cloud features, unrelated to external libraries or integrations (e.g. Bootstrap context and @RefreshScope).',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter'
            },
            {
                name: 'Function',
                id: 'cloud-function',
                description:
                    'Promotes the implementation of business logic via functions and supports a uniform programming model across serverless providers, as well as the ability to run standalone (locally or in a PaaS).',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-function-context'
            },
            {
                name: 'Task',
                id: 'cloud-task',
                description:
                    'Allows a user to develop and run short lived microservices using Spring Cloud. Run them locally, in the cloud, and on Spring Cloud Data Flow.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-task'
            }
        ]
    },
    {
        id: 'spring-cloud-routing',
        group: 'Spring Cloud Routing',
        packages: [
            {
                name: 'Gateway',
                id: 'cloud-gateway',
                description:
                    'Provides a simple, yet effective way to route to APIs and provide cross cutting concerns to them such as security, monitoring/metrics, and resiliency.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-gateway'
            }
        ]
    },
    {
        id: 'spring-cloud-circuit-breaker',
        group: 'Spring Cloud Circuit Breaker',
        packages: [
            {
                name: 'Resilience4J',
                id: 'cloud-resilience4j',
                description: 'Spring Cloud Circuit breaker with Resilience4j as the underlying implementation.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-circuitbreaker-resilience4j'
            }
        ]
    },
    {
        id: 'spring-cloud-messaging',
        group: 'Spring Cloud Messaging',
        packages: [
            {
                name: 'Cloud Bus',
                id: 'cloud-bus',
                description:
                    'Links nodes of a distributed system with a lightweight message broker which can used to broadcast state changes or other management instructions (requires a binder, e.g. Apache Kafka or RabbitMQ).',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-bus'
            },
            {
                name: 'Cloud Stream',
                id: 'cloud-stream',
                description:
                    'Framework for building highly scalable event-driven microservices connected with shared messaging systems (requires a binder, e.g. Apache Kafka, Apache Pulsar, RabbitMQ, or Solace PubSub+).',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-stream'
            }
        ]
    }
]
export default data
