import { APIS } from '../constants/Constants'
import { APIArgs } from '../models/models'

// Fetch users data from the backend
export const fetchUsersData = async (args: APIArgs) => {
  try {
    const url = `${APIS.LOCAL}${APIS.API_BASE}?search=${args.search}&field=${args.field}&direction=${args.direction}&size=${args.size}&page=${args.page}`
    const response = await fetch(url)
    return response
  } catch (error) {
    throw error
  }
}
