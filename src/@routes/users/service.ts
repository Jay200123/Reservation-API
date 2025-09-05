import UserRepository from "./repository";
import UserDetailsRepository from "../user_details/repository";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userDetailsRepository: UserDetailsRepository
  ) {}
}
