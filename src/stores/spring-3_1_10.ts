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
                version: '0.9.28'
            },
            {
                name: 'GraphQL DGS Code Generation',
                id: 'graphql-code-generation',
                description:
                    'Generate data types and type-safe APIs for querying GraphQL APIs by parsing schema files.',
                groupId: 'com.netflix.dgs.codegen',
                version: '6.0.3',
                plugin: true
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
            },
            {
                name: 'Docker Compose Support',
                id: 'docker-compose-setup',
                description: 'Provides docker compose support for enhanced development experience.',
                groupId: 'org.springframework.boot',
                artifactId: 'spring-boot-docker-compose'
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
                        groupId: 'org.springframework.security',
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
                version: '3.0.6'
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
                artifactId: 'spring-boot-starter-amqp',
                testPackages: [
                    {
                        name: 'Spring for RabbitMQ Test',
                        id: 'amqp-test',
                        description: '',
                        groupId: 'org.springframework.amqp',
                        artifactId: 'spring-rabbit-test'
                    }
                ]
            },
            {
                name: 'Spring for Apache Kafka',
                id: 'kafka',
                description: 'Publish, subscribe, store, and process streams of records.',
                groupId: 'org.springframework.kafka',
                artifactId: 'spring-kafka',
                testPackages: [
                    {
                        name: 'Spring for Apache Kafka Test',
                        id: 'kafka-test',
                        description: '',
                        groupId: 'org.springframework.kafka',
                        artifactId: 'spring-kafka-test'
                    }
                ]
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
                artifactId: 'spring-boot-starter-batch',
                testPackages: [
                    {
                        name: 'Spring Batch Test',
                        id: 'batch-test',
                        description: '',
                        groupId: 'org.springframework.batch',
                        artifactId: 'spring-batch-test'
                    }
                ]
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
            },
            {
                name: 'Picolli',
                id: 'picolli',
                description: 'Build command line applications with Picolli.',
                groupId: 'info.picocli',
                artifactId: 'picocli-spring-boot-starter',
                version: '4.7.5'
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
            },
            {
                name: 'SonarQube Scanner',
                id: 'sonarqubescanner',
                description:
                    'SonarQube is a self-managed, automatic code review tool that systematically helps you deliver clean code.',
                groupId: 'org.sonarqube',
                version: '4.4.1.3373',
                plugin: true
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
                name: 'Graphite',
                id: 'graphite',
                description:
                    'Publish Micrometer metrics to Graphite, a hierarchical metrics system backed by a fixed-size database.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-registry-graphite'
            },
            {
                name: 'Elastic APM Agent',
                id: 'elastic-apm-agent',
                description:
                    'Elastic APM Agent is an application performance monitoring system built on the Elastic Stack. It allows you to monitor software services and applications in real-time, by collecting detailed performance information on response time for incoming requests, database queries, calls to caches, external HTTP requests, and more. This makes it easy to pinpoint and fix performance problems quickly.',
                groupId: 'co.elastic.apm',
                artifactId: 'apm-agent-attach',
                version: '1.47.1'
            },
            {
                name: 'Distributed Tracing',
                id: 'distributed-tracing',
                description: 'Enable span and trace IDs logs.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-tracing-bridge-brave'
            },
            {
                name: 'Wavefront',
                id: 'wavefront',
                description:
                    'Publish metrics and optionally distributed traces to Tanzu Observability by Wavefront, a SaaS-based metrics monitoring and analytics platform that lets you visualize, query, and alert over data from across your entire stack.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-registry-wavefront'
            },
            {
                name: 'New Relic',
                id: 'newrelic',
                description:
                    'Publish Micrometer metrics to New Relic, a SaaS offering with a full UI and a query language called NRQL.',
                groupId: 'io.micrometer',
                artifactId: 'micrometer-registry-new-relic'
            },
            {
                name: 'Zipkin',
                id: 'zipkin',
                description: 'Enable and expose span and trace IDs to Zipkin.',
                groupId: 'io.zipkin.reporter2',
                artifactId: 'zipkin-reporter-brave'
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
                version: '6.25.0',
                plugin: true
            }
        ]
    },
    {
        id: 'code-coverage',
        group: 'Code Coverage',
        packages: [
            {
                name: 'JaCoCo',
                id: 'jacoco',
                description: 'JaCoCo is a free Java code coverage library.',
                parentName: 'Code Coverage',
                groupId: 'jacoco',
                version: '0.8.11',
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
                artifactId: 'spring-boot-testcontainers',
                testPackages: [
                    {
                        name: '',
                        id: 'testcontainers-test',
                        description: '',
                        groupId: 'org.testcontainers',
                        artifactId: 'junit-jupiter'
                    }
                ]
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
                name: 'Reactive Gateway',
                id: 'reactive-cloud-gateway',
                description:
                    'Provides a simple, yet effective way to route to APIs in reactive applications. Provides cross-cutting concerns to those APIs such as security, monitoring/metrics, and resiliency.',
                groupId: 'org.springframework.cloud',
                artifactId: 'spring-cloud-starter-gateway',
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
                artifactId: 'spring-cloud-stream',
                testPackages: [
                    {
                        name: 'Cloud Stream Test',
                        id: 'cloud-stream-test',
                        description: '',
                        groupId: 'org.springframework.cloud',
                        artifactId: 'spring-cloud-stream-test-binder'
                    }
                ]
            }
        ]
    },
    {
        id: 'spring-ai',
        group: 'AI',
        packages: [
            {
                name: 'Azure OpenAI',
                id: 'azure-openai',
                description:
                    'Spring AI support for Azure’s OpenAI offering, powered by ChatGPT. It extends beyond traditional OpenAI capabilities, delivering AI-driven text generation with enhanced functionality.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-azure-openai-spring-boot-starter'
            },
            {
                name: 'Azure AI Search AI',
                id: 'azure-ai-search-ai',
                description:
                    'Spring AI vector database support for Azure AI Search. It is an AI-powered information retrieval platform and part of Microsoft’s larger AI platform. Among other features, it allows users to query information using vector-based storage and retrieval.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-azure-vector-store-spring-boot-starter'
            },
            {
                name: 'Amazon Bedrock AI',
                id: 'amazon-bedrock-ai',
                description:
                    'Spring AI support for Amazon Bedrock. It is a managed service that provides foundation models from various AI providers, available through a unified API.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-bedrock-ai-spring-boot-starter'
            },
            {
                name: 'Chroma Vector Database AI',
                id: 'chroma-vector-database-ai',
                description:
                    'Spring AI vector database support for Chroma. It is an open-source embedding database and gives you the tools to store document embeddings, content, and metadata. It also allows to search through those embeddings, including metadata filtering.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-chroma-store-spring-boot-starter'
            },
            {
                name: 'Milvus Vector Database AI',
                id: 'milvus-vector-database-ai',
                description:
                    'Spring AI vector database support for Milvus. It is an open-source vector database that has garnered significant attention in the fields of data science and machine learning. One of its standout features lies in its robust support for vector indexing and querying.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-milvus-store-spring-boot-starter'
            },
            {
                name: 'Mistral AI AI',
                id: 'mistral-ai-ai',
                description:
                    'Spring AI support for Mistral AI, the open and portable generative AI for devs and businesses.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-mistral-ai-spring-boot-starter'
            },
            {
                name: 'Neo4J Vector Database AI',
                id: 'neo-4-j-vector-database-ai',
                description:
                    "Spring AI vector database support for Neo4j's Vector Search. It allows users to query vector embeddings from large datasets.",
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-neo4j-store-spring-boot-starter'
            },
            {
                name: 'Ollama AI',
                id: 'ollama-ai',
                description:
                    'Spring AI support for Ollama. It allows you to run various Large Language Models (LLMs) locally and generate text from them.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-ollama-spring-boot-starter'
            },
            {
                name: 'OpenAI AI',
                id: 'open-ai-ai',
                description:
                    'Spring AI support for ChatGPT, the AI language model and DALL-E, the Image generation model from OpenAI.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-openai-spring-boot-starter'
            },
            {
                name: 'PGvector Vector Database AI',
                id: 'pgvector-vector-database-ai',
                description:
                    'Spring AI vector database support for PGvector. It is an open-source extension for PostgreSQL that enables storing and searching over machine learning-generated embeddings.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-pgvector-store-spring-boot-starter'
            },
            {
                name: 'Pinecone Vector Database AI',
                id: 'pinecone-vector-database-ai',
                description:
                    'Spring AI vector database support for Pinecone. It is a popular cloud-based vector database and allows you to store and search vectors efficiently.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-pinecone-store-spring-boot-starter'
            },
            {
                name: 'PostgresML AI',
                id: 'postgres-ml-ai',
                description: 'Spring AI support for the PostgresML text embeddings models.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-postgresml-spring-boot-starter'
            },
            {
                name: 'Redis Search and Query Vector Database AI',
                id: 'redis-search-and-query-vector-database-ai',
                description:
                    'Spring AI vector database support for Redis Search and Query.It extends the core features of Redis OSS and allows you to use Redis as a vector database.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-redis-spring-boot-starter'
            },
            {
                name: 'Stability AI',
                id: 'stability-ai',
                description: "Spring AI support for Stability AI's text to image generation model.",
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-stability-ai-spring-boot-starter'
            },
            {
                name: 'Transformers (ONNX) Embeddings AI',
                id: 'transformers-onnx-embeddings-ai',
                description:
                    'Spring AI support for pre-trained transformer models, serialized into the Open Neural Network Exchange (ONNX) format.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-transformers-spring-boot-starter'
            },
            {
                name: 'Vertex AI PaLM2 AI',
                id: 'vertex-ai-pa-lm-2-ai',
                description: 'Spring AI support for Google Vertex PaLM2 chat and embedding models.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-vertex-ai-palm2-spring-boot-starter'
            },
            {
                name: 'Vertex AI Gemini AI',
                id: 'vertex-ai-gemini-ai',
                description: 'Spring AI support for Google Vertex Gemini chat.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-vertex-ai-gemini-spring-boot-starter'
            },
            {
                name: 'Qdrant Vector Database AI',
                id: 'qdrant-vector-database-ai',
                description:
                    'Spring AI vector database support for Qdrant. It is an open-source, high-performance vector search engine/database.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-qdrant-store-spring-boot-starter'
            },
            {
                name: 'Weaviate Vector Database AI',
                id: 'weaviate-vector-database-ai',
                description:
                    'Spring AI vector database support for Weaviate, an open-source vector database. It allows you to store data objects and vector embeddings from your favorite ML-models and scale seamlessly into billions of data objects.',
                groupId: 'org.springframework.ai',
                artifactId: 'spring-ai-weaviate-store-spring-boot-starter'
            },

            {
                name: 'Timefold Solver',
                id: 'timefold-solver',
                description: 'AI solver to optimize operations and scheduling.',
                groupId: 'ai.timefold.solver',
                artifactId: 'timefold-solver-spring-boot-starter'
            }
        ]
    }
]
export default data
