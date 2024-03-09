// LIBS
import Bottom from "@gorhom/bottom-sheet"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Keyboard, View } from "react-native"

import { useGoalRepository } from "@/database/useGoalRepository"
import { useTransactionRepository } from "@/database/useTransitionRepository"


// COMPONENTS
import { BackButton } from "@/components/BackButton"
import { BottomSheet } from "@/components/BottomSheet"
import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { Loading } from "@/components/Loading"
import { Progress } from "@/components/Progress"
import { TransactionTypeSelect } from "@/components/TransactionTypeSelect"
import { Transactions } from "@/components/Transactions"

// UTILS
import { TransactionResponse } from "@/database/useTransitionRepository"
import { currencyFormat } from "@/utils/currencyFormat"
import { useDateFormat } from "@/utils/dateUtils"

type Details = {
  name: string
  total: string
  current: string
  percentage: number
  transactions: TransactionResponse[]
}

export default function Details() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState<"up" | "down">("up")
  const [goal, setGoal] = useState<Details>({} as Details)

  // PARAMS
  const routeParams = useLocalSearchParams()
  const goalId = Number(routeParams.id)

  const useGoal = useGoalRepository()
  const useTransaction = useTransactionRepository()
  const dateFormat = useDateFormat();

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function fetchDetails() {
    try {
      if (goalId) {
        const goal = useGoal.show(goalId)
        const transactions = useTransaction.findByGoalId(goalId)

        if (!goal || !transactions) {
          return router.back()
        }

        setGoal({
          name: goal.name,
          current: currencyFormat(goal.current),
          total: currencyFormat(goal.total),
          percentage: (goal.current / goal.total) * 100,
          transactions: transactions.map((item) => ({
            ...item,
            date: dateFormat.formatDateTimeToMinutesAgo(item.created_at)
          })),
        })

        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteGoal(id: number) {
    try {
      Alert.alert("Atenção", "Deseja realmente excluir esta meta?", [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => { useGoal.deleteGoal(id), router.back() }

        }
      ])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleNewTransaction() {
    try {
      let amountAsNumber = Number(amount.replace(",", "."))

      if (isNaN(amountAsNumber) || amountAsNumber === 0) {
        return Alert.alert("Erro", "Valor inválido.")
      }


      if (type === "down") {
        amountAsNumber = amountAsNumber < 0 ? amountAsNumber : amountAsNumber * -1
      } else {
        amountAsNumber = amountAsNumber < 0 ? amountAsNumber * -1 : amountAsNumber
      }

      // console.log({ goalId, amount: amountAsNumber })
      useTransaction.create({ goal_id: goalId, amount: amountAsNumber, created_at: new Date().toUTCString() });

      Alert.alert("Sucesso", "Transação registrada!")

      handleBottomSheetClose()
      Keyboard.dismiss()

      setAmount("")
      setType("up")
      fetchDetails()
    } catch (error) {
      console.log(error)
    }
  }

  function handleDeleteTransaction(transactionId: string) {
    Alert.alert("Atenção", "Deseja realmente excluir esta transação?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Excluir",
        onPress: () => { useTransaction.deleteById(transactionId), fetchDetails() }
      }
    ])


  }

  useEffect(() => {
    fetchDetails()

  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 p-8 pt-12">
      <BackButton />


      <Header title={goal.name} subtitle={`${goal.current} de ${goal.total}`} hasActionButton handleOnPress={() => handleDeleteGoal(goalId)} />

      <Progress percentage={goal.percentage} />

      <Transactions transactions={goal.transactions} showDeleteButton handleDeleteTransaction={handleDeleteTransaction} />

      <View className="gap-2">
        <Button title="Nova transação" onPress={handleBottomSheetOpen} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova transação"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button title="Confirmar" onPress={handleNewTransaction} />
      </BottomSheet>
    </View>
  )
}
