import AbstractService from '@domain/AbstractService'
import { Request } from 'express'
import { IEndPointsRepository, IServiceResponse, IServiceUser, IServiceValidationGroup } from 'interfaces/domain'

export default class UserService extends AbstractService implements IServiceUser {
  createSchema: IServiceValidationGroup
  constructor (repository: IEndPointsRepository, createSchema: IServiceValidationGroup) {
    super(repository)
    this.createSchema = createSchema
  }

  async create (user: Request): Promise<IServiceResponse> {
    try {
      const { schema, context } = this.createSchema
      const newUser = await schema.validateAsync(user, context)
      this.repository.create(newUser)
      return { code: 201, info: 'User Created' }
    } catch (err: any) {
      return { code: 422, info: err }
    }
  }

  async readAll (): Promise<IServiceResponse> {
    try {
      const allUsers = this.repository.readAll()
      return { code: 200, info: `${allUsers}` }
    } catch (err) {
      return { code: 500, info: `${err}` }
    }
  }
}
