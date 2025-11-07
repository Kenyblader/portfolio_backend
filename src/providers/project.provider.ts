import { Project } from "src/models/project";

const projectProviders = [
    {
        provide: 'PROJECT_REPOSITORY',
        useValue: Project,
    }
]


export default projectProviders;