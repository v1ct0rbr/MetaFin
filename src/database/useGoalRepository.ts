import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
    total: number
    name: string
}

export type GoalResponseDatabase = {
    id: string
    name: string
    current: number
    total: number
}

export function useGoalRepository() {
    const database = useSQLiteContext();

    function create(goal: GoalCreateDatabase) {
        try {
            const statement = database.prepareSync(
                "INSERT INTO goals (name, total) VALUES ($name, $total)"
            )

            statement.executeSync({
                $name: goal.name,
                $total: goal.total
            })
        } catch (error) {
            console.log(error)
        }
    }

    function all() {
        try {
            return database.getAllSync<GoalResponseDatabase>(`
            select  g.id, g.name, g.total, COALESCE(sum(t.amount), 0) as current
            from goals as g left join transactions as t on g.id = t.goal_id
            group by g.id, g.name, g.total
           `)
        } catch (error) {
            console.log(error)
        }
    }

    function show(id: number) {
        try {
            const statement = database.prepareSync(`
            select  g.id, g.name, g.total, COALESCE(sum(t.amount), 0) as current
            from goals as g left join transactions as t on g.id = t.goal_id
            where g.id = $id
            group by g.id, g.name, g.total
           `)

            const result = statement.executeSync<GoalResponseDatabase>({ $id: id })

            return result.getFirstSync()
        } catch (error) {
            console.log(error)
        }

    }
    function deleteGoal(id) {
        try {
            const statement1 = database.prepareSync(
                "DELETE FROM transactions WHERE goal_id = $id;");
            statement1.executeSync({ $id: id });
            statement1.finalizeSync();
            const statement2 = database.prepareSync(
                "DELETE FROM goals WHERE id = $id;");
            statement2.executeSync({ $id: id });
            statement2.finalizeSync();
            console.log(`Goal with ID ${id} successfully deleted.`);
        } catch (error) {
            console.log(`Error deleting goal with ID ${id}: ${error}`);
        }
    }

    return {
        create,
        all,
        show,
        deleteGoal
    }
}