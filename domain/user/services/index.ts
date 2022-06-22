import AbstractService from '@domain/AbstractService'
import { Request } from 'express'
import { IRepositoryUser, IServiceResponse, IServiceUser, IServiceValidationGroup } from 'interfaces/domain'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class UserService extends AbstractService implements IServiceUser {
  repository: IRepositoryUser
  createSchema: IServiceValidationGroup
  constructor (
    @inject('UserRepository')
      repository: IRepositoryUser,
    @inject('UserCreateSchema')
      createSchema: IServiceValidationGroup
  ) {
    super(repository)
    this.repository = repository
    this.createSchema = createSchema
  }

  async create (user: Request): Promise<IServiceResponse> {
    try {
      const { schema } = this.createSchema
      const newUser = await schema.validateAsync(user)
      this.repository.create(newUser)
      return { code: 201, info: 'User Created' }
    } catch (err: any) {
      return { code: 422, info: err }
    }
  }

  async readAll (): Promise<IServiceResponse> {
    try {
      const allUsers = await this.repository.readAll()
      if (allUsers !== undefined) {
        const usersJSON = Object.fromEntries(allUsers)
        return { code: 200, info: usersJSON }
      }
      return { code: 404 }
    } catch (err) {
      return { code: 500, info: `${err}` }
    }
  }
}
