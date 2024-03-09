import { useSQLiteContext } from "expo-sqlite/next";

export type TransactionCreateDatabase = {
    amount: number
    goal_id: number,
    created_at: string
}

export type TransactionResponse = {
    id: string
    goal_id: number
    amount: number
    created_at: string
}

export function useTransactionRepository() {
    const database = useSQLiteContext();

    function findLatest() {
        try {
            return database.getAllSync<TransactionResponse>(`
            select id, goal_id, amount, created_at
            from transactions
            order by created_at desc
            limit 10
           `)
        } catch (error) {
            console.log(error)
        }
    }

    function create(transaction: TransactionCreateDatabase) {
        try {
            const statement = database.prepareSync(
                "INSERT INTO transactions (goal_id, amount, created_at) VALUES ($goal_id, $amount, $created_at)"
            )

            statement.executeSync({
                $goal_id: transaction.goal_id,
                $amount: transaction.amount,
                $created_at: transaction.created_at,
            })
        } catch (error) {
            console.log(error)
        }
    }

    function findByGoalId(goal_id: number) {
        try {
            return database.getAllSync<TransactionResponse>(`
            select  id, goal_id, amount, created_at
            from transactions
            where goal_id = $goal_id
            order by created_at desc
           `, { $goal_id: goal_id })
        } catch (error) {
            console.log(error)
        }
    }

    function deleteById(id: string) {
        try {
            const statement = database.prepareSync(`
            DELETE FROM transactions
            WHERE id = $id
            `)

            statement.executeSync({ $id: id })
        } catch (error) {
            console.log(error)
        }
    }

    return {
        create,
        findByGoalId,
        deleteById,
        findLatest
    }
}