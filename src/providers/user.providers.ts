import { User } from "src/models/user";

const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];

export { userProviders };