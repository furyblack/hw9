import { PaginationOutputType} from "../types/blogs/output";
import { usersCollection} from "../db/db";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {UserOutputType, userSortData} from "../types/users/outputUserType";
import {UserAccountDBType, UserMongoDbType} from "../types/users/inputUsersType";
import {strict} from "node:assert";


export class UserMapper {
    static toDto(user: WithId<UserAccountDBType>): UserOutputType {
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt.toISOString()

        }
    }
}

export class UserQueryRepository {
    static async getAll(sortData: userSortData): Promise<PaginationOutputType<UserOutputType[]>> {
        let {pageSize, pageNumber, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = sortData
        let filter:any = {
            $or:[]

        }
        if(sortBy==='login'){
            sortBy = 'userName'
        }
        if(sortData.searchEmailTerm){
            filter["$or"].push({email:{$regex: sortData.searchEmailTerm, $options:'i'}})
        }
        if(sortData.searchLoginTerm){
            filter["$or"].push({userName:{$regex: sortData.searchLoginTerm, $options:'i'}})
        }
        if(filter['$or']?.length === 0){
            filter["$or"].push({})
        }

        const user = await usersCollection
            .find(filter)
            .sort(sortBy, sortDirection as SortDirection)
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()


        const totalCount = await usersCollection.countDocuments(filter)

        return {

            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: user.map(u => UserMapper.toDto(u))
        }



    }
    static async getById(id:string  ):Promise<UserOutputType | null>{
        const currentUser= await usersCollection.findOne({_id:new ObjectId(id)})
        return currentUser? UserMapper.toDto(currentUser): null
    }

}
