import { defineStore } from 'pinia'
import type { Dependency, Package } from '@/entity/Dependency'
import spring3_0_9 from '@/stores/spring-3_0_9'
import spring3_1_2 from '@/stores/spring-3_1_2'
import vuejs from '@/stores/vuejs'
import { ProjectType } from '@/entity/ProjectType'
import { SpringBootVersion } from '@/entity/SpringBootVersion'

function getPackageNamesMap(dependencies: Dependency[]): Set<string> {
    return new Set(
        dependencies
            .map((d) => d.packages.map((p) => p.id))
            .reduce((acc, curVal) => {
                return acc.concat(curVal)
            })
    )
}

function getPackageInformationMap(dependencies: Dependency[]): Map<string, Package> {
    return new Map(
        dependencies
            .map((d) =>
                d.packages.map((p) => {
                    // We need to back-fill the parent name and supported option
                    return {
                        name: p.name,
                        id: p.id,
                        groupId: p.groupId,
                        artifactId: p.artifactId,
                        version: p.version,
                        description: p.description,
                        supported: true,
                        plugin: p.plugin,
                        parentName: d.group,
                        testPackages: p.testPackages
                    }
                })
            )
            .reduce((acc, curVal) => {
                return acc.concat(curVal)
            })
            .map((p) => [p.id, p])
    )
}

export const dependencyStore = defineStore('dependency', () => {
    const dependencies = new Map<string, Dependency[]>()
    dependencies.set(`${ProjectType.Spring}${SpringBootVersion['3_0_9']}`, spring3_0_9)
    dependencies.set(`${ProjectType.Spring}${SpringBootVersion['3_1_2']}`, spring3_1_2)
    dependencies.set(`${ProjectType.VueJS}`, vuejs)

    const packagesName = new Map<string, Set<string>>()
    packagesName.set(`${ProjectType.Spring}${SpringBootVersion['3_0_9']}`, getPackageNamesMap(spring3_0_9))
    packagesName.set(`${ProjectType.Spring}${SpringBootVersion['3_1_2']}`, getPackageNamesMap(spring3_1_2))
    packagesName.set(ProjectType.VueJS, getPackageNamesMap(vuejs))

    const packageInformation = new Map<string, Map<string, Package>>()
    packageInformation.set(
        ProjectType.Spring,
        new Map([...getPackageInformationMap(spring3_0_9), ...getPackageInformationMap(spring3_1_2)])
    )

    packageInformation.set(ProjectType.VueJS, new Map([...getPackageInformationMap(vuejs)]))

    function dependenciesByProjectType(projectType: string): Dependency[] {
        if (!dependencies.has(projectType)) {
            throw new Error('Unknown project type ' + projectType)
        }

        return dependencies.get(projectType) ?? []
    }

    function packageInformationByProjectType(projectType: ProjectType, packageId: string): Package {
        if (!packageInformation.has(projectType)) {
            throw new Error('Unknown project type ' + projectType)
        }

        if (!packageInformation.get(projectType)!!.has(packageId)) {
            throw new Error('Unknown package type ' + packageId)
        }

        return packageInformation.get(projectType)!!.get(packageId)!!
    }

    function dependenciesByProjectTypeForSpring(
        projectType: ProjectType,
        springBootVersion = SpringBootVersion['3_1_2']
    ): Dependency[] {
        if (!dependencies.has(projectType + springBootVersion)) {
            throw new Error('Unknown project type ' + projectType)
        }

        return dependencies.get(projectType + springBootVersion) ?? []
    }

    function checkPackageSupportForSpring(springBootVersion = SpringBootVersion['3_1_2'], packageId: string): boolean {
        if (!packagesName.has(`${ProjectType.Spring}${springBootVersion}`)) {
            throw new Error('Unknown or unsupported Spring Boot version ' + springBootVersion)
        }

        return packagesName.get(`${ProjectType.Spring}${springBootVersion}`)!!.has(packageId)
    }

    return {
        dependenciesByProjectType,
        dependenciesByProjectTypeForSpring,
        packageInformationByProjectType,
        checkPackageSupportForSpring
    }
})
