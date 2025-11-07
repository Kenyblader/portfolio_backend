import { Analitic } from "src/analitics/entities/analitic.entity";

export const AnaliticProviders = [{
    provide:'ANALITIC_REPOSITORY',
    useValue: Analitic
}]