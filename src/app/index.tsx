// LIBS
import Bottom from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Keyboard, View } from "react-native"

// COMPONENTS
import { BottomSheet } from "@/components/BottomSheet"
import { Button } from "@/components/Button"
import { Goals, GoalsProps } from "@/components/Goals"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { Transactions } from "@/components/Transactions"

//DATABASE

import { useGoalRepository } from "@/database/useGoalRepository"
import { TransactionResponse, useTransactionRepository } from "@/database/useTransitionRepository"

// UTILS
import { useDateFormat } from '@/utils/dateUtils'

export default function Home() {
  // LISTS
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [goals, setGoals] = useState<GoalsProps>([])

  // FORM
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")

  // DATABASE
  const useGoal = useGoalRepository()
  const useTransaction = useTransactionRepository()

  //UTILS
  const dateFormat = useDateFormat();

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    router.navigate("/details/" + id)
  }

  async function handleCreate() {
    try {
      let totalAsNumber = Number(total.toString().replace(",", "."))
      if (isNaN(totalAsNumber) || totalAsNumber === 0) {
        return Alert.alert("Erro", "Valor inválido.")
      }
      let valorFinal = totalAsNumber < 0 ? totalAsNumber * -1 : totalAsNumber;

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.")
      }

      useGoal.create({ name, total: valorFinal });

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert("Sucesso", "Meta cadastrada!")

      setName("")
      setTotal("")
      fetchGoals();
      fetchLastestTransactions();
    } catch (error) {
      Alert.alert("Erro", `Não foi possível cadastrar.`)
      console.log(error)
    }
  }

  async function fetchGoals() {
    try {
      const response = useGoal.all();
      setGoals(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchLastestTransactions() {
    try {
      const response = useTransaction.findLatest();
      setTransactions(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLastestTransactions()
    fetchGoals()


  }, [])

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Nome da meta" onChangeText={setName} value={name} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Criar" onPress={handleCreate} />
      </BottomSheet>
    </View>
  )
}
