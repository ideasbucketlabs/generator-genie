export interface Dependency {
    id: string
    group: string
    packages: Array<Package>
}

export interface Package {
    name: string
    id: string
    groupId?: string
    artifactId?: string
    version?: string
    description: string
    supported?: boolean
    plugin?: boolean
    parentName?: string
    testPackages?: Package[]
}
